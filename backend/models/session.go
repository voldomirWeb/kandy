package models

import (
	"time"

	"gorm.io/gorm"
)

type Session struct {
	ID           uint           `gorm:"primarykey" json:"id"`
	UserID       uint           `gorm:"index;not null" json:"user_id"`
	User         *User          `gorm:"foreignKey:UserID" json:"-"`
	Token        string         `gorm:"type:varchar(500);uniqueIndex;not null" json:"-"`
	RefreshToken string         `gorm:"type:varchar(500);uniqueIndex;not null" json:"-"`
	IPAddress    string         `gorm:"type:varchar(45)" json:"ip_address"`
	UserAgent    string         `gorm:"type:varchar(500)" json:"user_agent"`
	ExpiresAt    time.Time      `gorm:"not null" json:"expires_at"`
	LastUsedAt   time.Time      `gorm:"not null" json:"last_used_at"`
	CreatedAt    time.Time      `json:"created_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

func (s *Session) TableName() string {
	return "sessions"
}

func (s *Session) IsExpired() bool {
	return time.Now().After(s.ExpiresAt)
}
