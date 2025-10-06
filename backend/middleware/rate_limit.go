package middleware

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sebastian/kandy/backend/database"
	"github.com/sebastian/kandy/backend/models"
)

func RateLimitLogin() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Read the body
		bodyBytes, err := io.ReadAll(c.Request.Body)
		if err != nil {
			c.Next()
			return
		}

		c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

		var body map[string]interface{}
		email := ""
		if err := json.Unmarshal(bodyBytes, &body); err == nil {
			if e, ok := body["email"].(string); ok {
				email = e
			}
		}

		if email == "" {
			c.Next()
			return
		}

		c.Set("login_email", email)

		clientIP := c.ClientIP()

		// Check failed attempts in last 15 minutes
		fifteenMinutesAgo := time.Now().Add(-15 * time.Minute)
		var failedAttempts int64

		database.DB.Model(&models.LoginAttempt{}).
			Where("email = ? AND ip_address = ? AND success = ? AND created_at > ?",
				email, clientIP, false, fifteenMinutesAgo).
			Count(&failedAttempts)

		// Block if more than 5 failed attempts
		if failedAttempts >= 5 {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Too many failed login attempts. Please try again in 15 minutes.",
			})
			c.Abort()
			return
		}

		c.Next()

		logLoginAttempt(c, email)
	}
}

func logLoginAttempt(c *gin.Context, email string) {
	if email == "" {
		return
	}

	success := c.Writer.Status() == http.StatusOK
	failReason := ""
	if !success {
		failReason = "Invalid credentials"
		if c.Writer.Status() == http.StatusTooManyRequests {
			failReason = "Rate limited"
		} else if c.Writer.Status() == http.StatusForbidden {
			failReason = "Account deactivated"
		}
	}

	attempt := models.LoginAttempt{
		Email:      email,
		IPAddress:  c.ClientIP(),
		Success:    success,
		FailReason: failReason,
	}

	database.DB.Create(&attempt)
}
