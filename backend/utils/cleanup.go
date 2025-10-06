package utils

import (
	"log"
	"time"

	"github.com/sebastian/kandy/backend/database"
	"github.com/sebastian/kandy/backend/models"
)

func CleanupExpiredSessions() {
	result := database.DB.Unscoped().Where("expires_at < ?", time.Now()).Delete(&models.Session{})
	if result.Error != nil {
		log.Printf("Failed to cleanup expired sessions: %v", result.Error)
	} else if result.RowsAffected > 0 {
		log.Printf("Cleaned up %d expired sessions", result.RowsAffected)
	}
}

func CleanupOldLoginAttempts() {
	thirtyDaysAgo := time.Now().Add(-30 * 24 * time.Hour)
	result := database.DB.Unscoped().Where("created_at < ?", thirtyDaysAgo).Delete(&models.LoginAttempt{})
	if result.Error != nil {
		log.Printf("Failed to cleanup old login attempts: %v", result.Error)
	} else if result.RowsAffected > 0 {
		log.Printf("Cleaned up %d old login attempts", result.RowsAffected)
	}
}

func ScheduleCleanup() {
	CleanupExpiredSessions()
	CleanupOldLoginAttempts()

	// Schedule cleanup to run every 24 hours
	ticker := time.NewTicker(24 * time.Hour)
	go func() {
		for range ticker.C {
			CleanupExpiredSessions()
			CleanupOldLoginAttempts()
		}
	}()
}
