package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sebastian/kandy/backend/handlers"
	"github.com/sebastian/kandy/backend/middleware"
	"github.com/sebastian/kandy/backend/models"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	registerPublicRoutes(r)
	registerAuthRoutes(r)
	registerProtectedRoutes(r)

	return r
}

func registerPublicRoutes(r *gin.Engine) {
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
		})
	})
}

func registerAuthRoutes(r *gin.Engine) {
	auth := r.Group("/api/auth")
	{
		auth.POST("/register", handlers.Register)
		auth.POST("/login", middleware.RateLimitLogin(), handlers.Login)
		auth.POST("/logout", middleware.AuthMiddleware(), handlers.Logout)
		auth.POST("/password-reset/request", handlers.RequestPasswordReset)
		auth.POST("/password-reset/confirm", handlers.ResetPassword)
		auth.POST("/accept-invitation", handlers.AcceptInvitation)

		auth.POST("/refresh", handlers.RefreshToken)
	}
}

func registerProtectedRoutes(r *gin.Engine) {
	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())
	{
		api.GET("/profile", handlers.GetProfile)
		api.POST("/password/change", handlers.ChangePassword)

		sessions := api.Group("/sessions")
		{
			sessions.GET("", handlers.GetActiveSessions)
			sessions.DELETE("/:id", handlers.RevokeSession)
			sessions.DELETE("", handlers.RevokeAllSessions)
		}

		admin := api.Group("/admin")
		admin.Use(middleware.RequireRole(models.RoleAdmin))
		{
			admin.POST("/invite", handlers.InviteUser)
			admin.GET("/invitations", handlers.GetPendingInvitations)
			admin.POST("/invitations/:id/resend", handlers.ResendInvitation)
			admin.DELETE("/invitations/:id", handlers.CancelInvitation)
		}
	}
}
