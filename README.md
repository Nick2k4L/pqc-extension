# PQC Checker - Post-Quantum Cryptography Browser Extension

Course project for CptS 428 Software Security and Reverse Engineering

**Team name: Comet3**

## Team Members
- [Ivan Kwok](mailto:ivan.kwok@wsu.edu)
- [David Tran](mailto:david.tran1@wsu.edu) (contact)
- [Andrew Varkey](mailto:andrew.varkey@wsu.edu)
- [Nicholas Lopez](mailto:nicholas.b.lopez@wsu.edu)
- [Alan Sun](mailto:alan.sun@wsu.edu)

## Table of Contents
- [Description](#description)
- [Preview](#preview)
- [Prerequisites](#prerequisites) 
- [Installation](#installation)
- [Usage](#usage)
- [Acknowledgements](#acknowledgements)

## Description
PQC Checker is a browser extension that analyzes websites to determine if they support Post-Quantum Cryptography (PQC). With the advent of quantum computing, traditional cryptographic methods may become vulnerable, making PQC support crucial for future-proof web security.

## Preview
![Screenshot 2025-10-08 213337](https://github.com/user-attachments/assets/71eebfda-150c-4632-88b6-ed3db6449099)

## Quick Start with Docker (Recommended)

### Prerequisites for Docker Method
- **Docker** - [Download here](https://www.docker.com/get-started)
- **Google Chrome** (or any Chromium-based browser)
- **Git** - For cloning the repository

### Step 1: Clone and Run with Docker

```bash
# Clone the repository
git clone <https://github.com/davitran22/Comet3/>
cd "CPT_S 428/Comet3"

# Build and run the Docker container
docker build -t pqc-checker .
docker run -d -p 8080:8080 --name pqc-app pqc-checker
```

✅ **That's it!** Your backend server is now running at `http://localhost:8080`

### Step 2: Set Up the Browser Extension

1. **Extract the built extension from Docker:**
   ```bash
   # Create a local directory for the extension
   mkdir -p extension-files
   
   # Copy the built extension from the container
   docker cp pqc-app:/app/static ./extension-files/
   
   # Copy the manifest file
   cp extension/manifest.json ./extension-files/static/
   ```

2. **Load the extension in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `extension-files/static` folder

---

## Manual Installation (Without Docker)

Before you begin, ensure you have the following installed on your system:

### Required Software
1. **Go (Golang)** - Version 1.19 or higher
   - **Download:** https://golang.org/dl/
   - **Verify installation:** `go version`
   - **Why needed:** Powers the backend API server

2. **Node.js** - Version 18 or higher
   - **Download:** https://nodejs.org/
   - **Verify installation:** `node --version`
   - **Why needed:** Builds the React frontend extension

3. **npm** - Comes automatically with Node.js
   - **Verify installation:** `npm --version`

4. **Git** - For cloning the repository
   - **Download:** https://git-scm.com/
   - **Verify installation:** `git --version`

5. **Google Chrome** (or any Chromium-based browser)
   - **Download:** https://www.google.com/chrome/
   - **Why needed:** To run the browser extension

## Installation

### Step 1: Clone the Repository
```bash
git clone <https://github.com/davitran22/Comet3/>
cd "CPT_S 428/Comet3"
```

### Step 2: Set Up the Backend Server

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install Go dependencies:**
   ```bash
   go mod tidy
   ```

3. **Start the backend server:**
   ```bash
   go run main.go
   ```
   
   ✅ **Success indicator:** You should see:
   ```
   [GIN-debug] Listening and serving HTTP on :8080
   ```

   ⚠️ **Keep this terminal window open** - the server must remain running for the extension to work.

### Step 3: Build the Frontend Extension

1. **Open a new terminal** and navigate to the frontend directory:
   ```bash
   cd extension/pqc-frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Build the extension:**
   ```bash
   npm run build
   ```
   
   ✅ **Success indicator:** A `dist` folder should be created with the built extension files.

4. **Copy the manifest file to the build directory:**
   ```bash
   cp ../manifest.json dist/
   ```

### Step 4: Load the Extension in Chrome

1. **Open Google Chrome** and navigate to:
   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the extension:**
   - Click "Load unpacked"
   - Navigate to and select the `dist` folder:
     ```
     /path/to/your/project/Comet3/extension/pqc-frontend/dist
     ```

4. **Verify installation:**
   - You should see "PQC Checker" appear in your extensions list
   - The extension icon should appear in your browser toolbar

## Usage

### Testing the Extension

1. **Ensure the backend is running:**
   - Check that your terminal shows: `[GIN-debug] Listening and serving HTTP on :8080`

2. **Navigate to any website:**
   - Example: `https://google.com`
   - Example: `https://github.com`
   - Example: `https://facebook.com`

3. **Click the PQC Checker extension icon** in your browser toolbar

4. **Click "Check PQC Readiness"** button

5. **View results:**
   - 🟢 **Green "Ready!" chip** = Website supports Post-Quantum Cryptography
   - 🔴 **Red "Not Ready" chip** = Website does not support PQC
   - ⚠️ **Error message** = Connection issue or analysis failed

### Example Test Cases

| Website | Expected Result | Notes |
|---------|----------------|-------|
| `google.com` | ✅ Ready | Google has implemented PQC |
| `github.com` | ❌ Not Ready | Check current PQC adoption status |


## Acknowledgements

- **Material-UI (MUI)** - For the beautiful React components
- **Gin Framework** - For the lightweight Go web framework
- **Vite** - For fast frontend build tooling
- **WebExtension Polyfill** - For cross-browser compatibility
- **CertificateTools API** - For PQC analysis capabilities

---

**Need help?** Contact the team lead: [David Tran](mailto:david.tran1@wsu.edu) 

