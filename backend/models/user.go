package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserRole string

const (
	RoleAdmin         UserRole = "admin"
	RoleHiringManager UserRole = "hiring_manager"
)

type User struct {
	ID           uint     `gorm:"primarykey" json:"id"`
	Email        string   `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string   `gorm:"not null" json:"-"` // Never expose in JSON
	Role         UserRole `gorm:"type:varchar(50);not null;default:'read_only'" json:"role"`
	Name         string   `gorm:"not null" json:"name"`
	IsActive     bool     `gorm:"default:true" json:"is_active"`

	// Login tracking
	LastLoginAt *time.Time `json:"last_login_at,omitempty"`

	// Account security
	EmailVerified       bool       `gorm:"default:true" json:"email_verified"`
	VerificationToken   *string    `gorm:"type:varchar(255)" json:"-"`
	ResetPasswordToken  *string    `gorm:"type:varchar(255)" json:"-"`
	ResetPasswordExpiry *time.Time `json:"-"`

	// Invitation system
	InvitedBy            *uint      `gorm:"index" json:"invited_by,omitempty"`
	InvitedByUser        *User      `gorm:"foreignKey:InvitedBy" json:"-"`
	InvitationToken      *string    `gorm:"type:varchar(255);uniqueIndex" json:"-"`
	InvitationSentAt     *time.Time `json:"invitation_sent_at,omitempty"`
	InvitationAcceptedAt *time.Time `json:"invitation_accepted_at,omitempty"`

	// Soft delete support
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	// Timestamps
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (u *User) HashPassword(password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.PasswordHash = string(hashedPassword)
	return nil
}

func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
	return err == nil
}

func (u *User) BeforeCreate(_ *gorm.DB) error {
	if u.Role == "" {
		u.Role = RoleHiringManager
	}
	return nil
}

func (u *User) TableName() string {
	return "users"
}

func (u *User) IsInvitationPending() bool {
	return u.InvitationToken != nil && u.InvitationAcceptedAt == nil
}

func (u *User) HasAcceptedInvitation() bool {
	return u.InvitationAcceptedAt != nil
}
