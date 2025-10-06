package models

import (
	"time"

	"gorm.io/gorm"
)

type LoginAttempt struct {
	ID         uint           `gorm:"primarykey" json:"id"`
	Email      string         `gorm:"type:varchar(255);index;not null" json:"email"`
	IPAddress  string         `gorm:"type:varchar(45);index;not null" json:"ip_address"`
	Success    bool           `gorm:"not null" json:"success"`
	FailReason string         `gorm:"type:varchar(255)" json:"fail_reason,omitempty"`
	CreatedAt  time.Time      `json:"created_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

func (l *LoginAttempt) TableName() string {
	return "login_attempts"
}
