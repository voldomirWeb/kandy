package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/sebastian/kandy/backend/database"
	"github.com/sebastian/kandy/backend/routes"
	"github.com/sebastian/kandy/backend/utils"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using environment variables or defaults")
	}

	database.Connect()

	utils.ScheduleCleanup()

	r := routes.SetupRouter()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
