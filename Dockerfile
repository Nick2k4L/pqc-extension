# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /app/frontend

# Copy package files
COPY extension/pqc-frontend/package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy frontend source code
COPY extension/pqc-frontend/ ./

# Build the frontend
RUN npm run build

# Stage 2: Build the Go backend
FROM golang:1.25-alpine AS backend-builder

# Set working directory for backend
WORKDIR /app/backend

# Copy go mod files
COPY server/go.mod server/go.sum ./

# Download dependencies
RUN go mod download

# Copy backend source code
COPY server/ ./

# Build the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Stage 3: Final runtime image
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Set working directory
WORKDIR /app

# Copy the built Go binary from backend-builder stage
COPY --from=backend-builder /app/backend/main .

# Copy the built frontend from frontend-builder stage
COPY --from=frontend-builder /app/frontend/dist ./static
COPY --from=frontend-builder /app/frontend/dist/index.html ./static/

# Copy the manifest and icons
COPY extension/manifest.json ./static/
COPY extension/icons ./static/icons/

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port 8080
EXPOSE 8080

# Command to run the application
CMD ["./main"]