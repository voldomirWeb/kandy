package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sebastian/kandy/backend/database"
	"github.com/sebastian/kandy/backend/models"
	"github.com/sebastian/kandy/backend/utils"
)

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=8"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

func ChangePassword(c *gin.Context) {
	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if !user.CheckPassword(req.CurrentPassword) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Current password is incorrect"})
		return
	}

	if err := user.HashPassword(req.NewPassword); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Password changed successfully",
	})
}

func GetActiveSessions(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var sessions []models.Session
	if err := database.DB.Where("user_id = ? AND expires_at > ?", userID, time.Now()).
		Order("last_used_at DESC").
		Find(&sessions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve sessions"})
		return
	}

	// Format response
	sessionList := make([]gin.H, len(sessions))
	for i, session := range sessions {
		sessionList[i] = gin.H{
			"id":           session.ID,
			"ip_address":   session.IPAddress,
			"user_agent":   session.UserAgent,
			"last_used_at": session.LastUsedAt,
			"created_at":   session.CreatedAt,
			"expires_at":   session.ExpiresAt,
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"sessions": sessionList,
		"count":    len(sessionList),
	})
}

func RevokeSession(c *gin.Context) {
	sessionID := c.Param("id")
	userID, _ := c.Get("user_id")

	var session models.Session
	if err := database.DB.Where("id = ? AND user_id = ?", sessionID, userID).First(&session).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}

	if err := database.DB.Unscoped().Delete(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to revoke session"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Session revoked successfully",
	})
}

func RevokeAllSessions(c *gin.Context) {
	userID, _ := c.Get("user_id")

	authHeader := c.GetHeader("Authorization")
	currentToken := ""
	if len(authHeader) > 7 {
		currentToken = authHeader[7:] // Remove "Bearer " prefix
	}

	if err := database.DB.Unscoped().Where("user_id = ? AND token != ?", userID, currentToken).
		Delete(&models.Session{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to revoke sessions"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "All other sessions revoked successfully",
	})
}

func RefreshToken(c *gin.Context) {
	var req RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	claims, err := utils.ValidateJWT(req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired refresh token"})
		return
	}

	var session models.Session
	if err := database.DB.Where("refresh_token = ? AND user_id = ?", req.RefreshToken, claims.UserID).
		First(&session).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Session not found or expired"})
		return
	}

	if session.IsExpired() {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Session has expired"})
		return
	}

	newToken, err := utils.GenerateJWT(claims.UserID, claims.Email, claims.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	session.Token = newToken
	session.LastUsedAt = time.Now()
	database.DB.Save(&session)

	c.JSON(http.StatusOK, gin.H{
		"token":   newToken,
		"message": "Token refreshed successfully",
	})
}
