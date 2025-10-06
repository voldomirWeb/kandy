package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sebastian/kandy/backend/database"
	"github.com/sebastian/kandy/backend/models"
	"github.com/sebastian/kandy/backend/utils"
)

// InviteUserRequest represents the invitation request payload
type InviteUserRequest struct {
	Email string          `json:"email" binding:"required,email"`
	Name  string          `json:"name" binding:"required"`
	Role  models.UserRole `json:"role" binding:"required"`
}

// AcceptInvitationRequest represents the accept invitation payload
type AcceptInvitationRequest struct {
	Token    string `json:"token" binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
}

// InviteUser creates a new user invitation (Admin only)
func InviteUser(c *gin.Context) {
	var req InviteUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get admin user ID from context
	adminID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Admin user not found"})
		return
	}

	// Check if user with email already exists
	var existingUser models.User
	if err := database.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User with this email already exists"})
		return
	}

	// Generate invitation token
	token, err := utils.GenerateRandomToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate invitation token"})
		return
	}

	// Create user with invitation
	now := time.Now()
	adminIDUint := adminID.(uint)
	user := models.User{
		Email:            req.Email,
		Name:             req.Name,
		Role:             req.Role,
		IsActive:         false, // User is inactive until they accept invitation
		EmailVerified:    false, // Will be verified when they accept invitation
		InvitedBy:        &adminIDUint,
		InvitationToken:  &token,
		InvitationSentAt: &now,
		PasswordHash:     "PENDING", // Placeholder - will be set when invitation is accepted
	}

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create invitation"})
		return
	}

	// TODO: Send email with invitation link
	c.JSON(http.StatusCreated, gin.H{
		"message": "Invitation sent successfully",
		"user": gin.H{
			"id":    user.ID,
			"email": user.Email,
			"name":  user.Name,
			"role":  user.Role,
		},
		"invitation_token": token, // REMOVE THIS IN PRODUCTION - only for testing
	})
}

func AcceptInvitation(c *gin.Context) {
	var req AcceptInvitationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("invitation_token = ?", req.Token).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired invitation token"})
		return
	}

	if user.InvitationAcceptedAt != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invitation has already been accepted"})
		return
	}

	if user.InvitationSentAt != nil {
		expiryDuration := 7 * 24 * time.Hour // 7 days
		if time.Since(*user.InvitationSentAt) > expiryDuration {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invitation has expired"})
			return
		}
	}

	if err := user.HashPassword(req.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	now := time.Now()
	user.InvitationAcceptedAt = &now
	user.InvitationToken = nil
	user.IsActive = true
	user.EmailVerified = true

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to accept invitation"})
		return
	}

	// Generate JWT tokens
	token, err := utils.GenerateJWT(user.ID, user.Email, string(user.Role))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	refreshToken, err := utils.GenerateRefreshToken(user.ID, user.Email, string(user.Role))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	// Create session
	session := models.Session{
		UserID:       user.ID,
		Token:        token,
		RefreshToken: refreshToken,
		IPAddress:    c.ClientIP(),
		UserAgent:    c.GetHeader("User-Agent"),
		ExpiresAt:    time.Now().Add(30 * 24 * time.Hour), // 30 days
		LastUsedAt:   time.Now(),
	}
	database.DB.Create(&session)

	c.JSON(http.StatusOK, gin.H{
		"message":       "Invitation accepted successfully",
		"token":         token,
		"refresh_token": refreshToken,
		"user": gin.H{
			"id":    user.ID,
			"email": user.Email,
			"name":  user.Name,
			"role":  user.Role,
		},
	})
}

func GetPendingInvitations(c *gin.Context) {
	var users []models.User

	if err := database.DB.Where("invitation_token IS NOT NULL AND invitation_accepted_at IS NULL").
		Order("invitation_sent_at DESC").
		Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve invitations"})
		return
	}

	invitations := make([]gin.H, len(users))
	for i, user := range users {
		invitations[i] = gin.H{
			"id":                 user.ID,
			"email":              user.Email,
			"name":               user.Name,
			"role":               user.Role,
			"invitation_sent_at": user.InvitationSentAt,
			"invited_by":         user.InvitedBy,
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"invitations": invitations,
		"count":       len(invitations),
	})
}

func ResendInvitation(c *gin.Context) {
	userID := c.Param("id")

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if user.InvitationAcceptedAt != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invitation has already been accepted"})
		return
	}

	token, err := utils.GenerateRandomToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate invitation token"})
		return
	}

	now := time.Now()
	user.InvitationToken = &token
	user.InvitationSentAt = &now

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to resend invitation"})
		return
	}

	// TODO: Send email with new invitation link
	c.JSON(http.StatusOK, gin.H{
		"message":          "Invitation resent successfully",
		"invitation_token": token, // REMOVE THIS IN PRODUCTION
		"invitation_link":  "http://localhost:3000/accept-invitation?token=" + token,
	})
}

func CancelInvitation(c *gin.Context) {
	userID := c.Param("id")

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if user.InvitationAcceptedAt != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot cancel - invitation has already been accepted"})
		return
	}

	// Permanently delete the user (hard delete) since they never activated their account
	if err := database.DB.Unscoped().Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to cancel invitation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Invitation cancelled successfully",
	})
}
