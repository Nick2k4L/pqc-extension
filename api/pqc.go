package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Response ResponseBody `json:"response"`
}

// ResponseData maps to the "response" object in the JSON
type ResponseBody struct {
	Handshake IsPQCReady `json:"TLSHandshake"`
}

// HandshakeData maps to the "TLSHandshake" object and contains the value you want
type IsPQCReady struct {
	PQCReady bool `json:"pqcready"`
}

// This is our payload to send to the external API
type Payload struct {
	Hostname string `json:"hostname"`
	Port     string `json:"port"`
}

// TODO: Need to figure out a way for the backend to "GET" user hostname and port,
// Then send in the POST request based on that

// This function sends our POST request to the api
func sendPostRequest(hostname string, c *gin.Context) {

	// err := godotenv.Load()

	// if err != nil {
	// 	fmt.Println("Error Loading .env file")
	// 	return
	// }

	// Need to give it a Hostname & Port to run on
	payload := Payload{
		Hostname: hostname,
		Port:     "443",
	}

	// This converts our payload into JSON Bytes,
	// They look like this {"hostname": "google.com", "port":"443"}
	jsonPayload, err := json.Marshal(payload)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal payload"})
		return
	}

	externalURL := "https://certificatetools.com/api/openssl/PQCTest"

	// We are preparing a new HTTP POST request,
	// Method: "POST", URL: "externalURL", Body: "converts JSON bytes into readable streams"
	request, err := http.NewRequest("POST", externalURL, bytes.NewBuffer(jsonPayload))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create external request"})
		return
	}

	// Sets the HTTP header to tell the server that the request will contain JSON data
	request.Header.Set("Content-Type", "application/json")

	// Creates a new HTTP client
	client := &http.Client{}

	// Sens the request and stores the response
	response, err := client.Do(request)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send external request"})
		return
	}

	// This is to close the HTTP properly, the defer keyword tells us to do it at the end of
	// the function no matter what
	defer response.Body.Close()

	var apiResponse APIResponse

	// Converts the JSON data into our APIResponse struct
	if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode external response"})
		return
	}

	// Now going down our struct tree to get the PQCReadiness of our website
	pqcReady := apiResponse.Response.Handshake.PQCReady

	// Print the response for debugging
	fmt.Printf("Response status: %+v\n", apiResponse)
	fmt.Printf("PQCReady value: %t\n", pqcReady)

	c.JSON(http.StatusOK, gin.H{"isReady": pqcReady})

}

// We need to set cors permission for our API calls
func setCorsPermission(router *gin.Engine) *gin.Engine {
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	return router

}

func Handler(w http.ResponseWriter, r *http.Request) {
	router := gin.Default()
	router = setCorsPermission(router)

	router.GET("/", func(c *gin.Context) {
		hostname := c.Query("hostname")
		if hostname == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "hostname parameter is required"})
			return
		}
		sendPostRequest(hostname, c)
	})

	router.ServeHTTP(w, r)
}
