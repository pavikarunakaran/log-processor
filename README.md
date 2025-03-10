# Log Processor Application
This project is a Log Processing Application that allows users to upload log files, process them in the background, and visualize the results using charts and tables. The application is built using a microservices architecture with a frontend, backend, WebSocket server, and Redis for job queueing. It also integrates with Supabase for authentication and data storage.

---------------------------------------------------------------------------------------------------------------------------------

# Table of Contents

1. Features
2. Technologies Used
3. Architecture
4. Setup and Installation
5. Environment Variables
6. Running the Application
7. API Endpoints
8. WebSocket Communication
9. Docker Compose Configuration
10. Frontend and Backend Dockerfiles
11. Testing
12. Login Page

---------------------------------------------------------------------------------------------------------------------------------

## Features

- **File Upload**: Users can upload log files for processing.
- **Background Processing**: Log files are processed asynchronously using a job queue (BullMQ) with Redis.
- **Real-Time Updates**: Progress and status updates are sent to the frontend via WebSocket.
- **Data Visualization**: Processed log data is displayed using charts (Chart.js) and tables.
- **Authentication**: Users can log in using email/password or GitHub OAuth (Supabase).
- **Error Tracking**: Errors in log files are tracked and displayed.
- **Keyword and IP Tracking**: Keywords and IP addresses in log files are counted and visualized.

## Technologies Used

- **Frontend**: Next.js, React, Chart.js
- **Backend**: Node.js, Express, BullMQ
- **Database**: Supabase (PostgreSQL)
- **Job Queue**: Redis
- **Real-Time Communication**: WebSocket
- **Containerization**: Docker, Docker Compose
- **Authentication**: Supabase Auth
- **Testing**: Jest, Supertest

## Architecture

The application is divided into the following components:

- **Frontend**: A Next.js application that provides the user interface for uploading log files and viewing processed data.
- **Backend**: A Node.js/Express server that handles file uploads, job queueing, and communication with Supabase.
- **WebSocket Server**: A WebSocket server that sends real-time updates (e.g., progress, status) to the frontend.
- **Redis**: Used as a message broker for job queueing (BullMQ).
- **Supabase**: Handles authentication and stores processed log data.

## Setup and Installation

### Prerequisites

- Docker and Docker Compose installed on your machine.
- A Supabase project with the following:
  - A `log_stats` table to store processed log data.
  - Environment variables for Supabase URL and key.

### Steps

1. Clone the repository:

```bash
git clone <repository-url>
cd log-processor
```

2. Create a `.env` file in the root directory with the following environment variables:

```env
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>
KEYWORDS=<comma-separated-keywords>  # e.g., ERROR,WARNING,INFO
```

3. Build and run the application using Docker Compose:

```bash
docker-compose up --build
```

4. Access the application:

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- WebSocket Server: ws://localhost:8080

## Environment Variables

| Variable        | Description                                                     |
|-----------------|-----------------------------------------------------------------|
| SUPABASE_URL    | URL of your Supabase project.                                   |
| SUPABASE_KEY    | API key for your Supabase project.                              |
| KEYWORDS        | Comma-separated list of keywords to track in log files (e.g., ERROR,WARNING). |
| REDIS_HOST      | Host for Redis (default: redis).                                |
| REDIS_PORT      | Port for Redis (default: 6379).                                 |
| WEBSOCKET_URL   | URL for the WebSocket server (default: ws://websocket:8080).    |

## Running the Application

- **Frontend**: The frontend is a Next.js application that runs on port 3001. It provides the UI for uploading log files and viewing processed data.
- **Backend**: The backend runs on port 3000 and handles file uploads, job processing, and communication with Supabase.
- **WebSocket Server**: The WebSocket server runs on port 8080 and sends real-time updates to the frontend.
- **Redis**: Redis is used for job queueing and runs on port 6379.

## API Endpoints

Backend API (http://localhost:3000/api)

- **POST /upload-logs**: Upload a log file for processing.
- **GET /stats**: Fetch all processed log stats.
- **GET /stats/:jobId**: Fetch stats for a specific job ID.
- **GET /queue-status**: Get the status of the job queue.

## WebSocket Communication

The WebSocket server sends real-time updates to the frontend, including:

- **Progress**: Percentage of log file processing completed.
- **Status**: Current status of the job (e.g., started, completed).

Example WebSocket message:

```json
{
  "fileId": "12345",
  "progress": 50,
  "status": "started"
}
```

## Docker Compose Configuration

The `docker-compose.yml` file defines the following services:

- **Redis**: Used for job queueing.
- **WebSocket**: WebSocket server for real-time updates.
- **Backend**: Node.js backend for processing log files.
- **Frontend**: Next.js frontend for user interaction.

## Frontend and Backend Dockerfiles

### Backend Dockerfile

1. Base Image: Node.js 20
2. Steps:
   - Copy and install backend dependencies.
   - Copy backend code.
   - Run tests.
   - Start the backend server and worker.

### Frontend Dockerfile

1. Base Image: Node.js 20
2. Steps:
   - Copy and install frontend dependencies.
   - Copy frontend code.
   - Build the Next.js app.
   - Start the development server.

## Testing

The application includes both unit tests and integration tests to ensure the reliability of the backend.

### Test Suites

- **Integration Tests** (`backend/tests/integration/routes.test.js`):
  - Tests the API routes, including file upload and job creation.
  - Uses supertest to simulate HTTP requests and jest for assertions.
  - Mocks multer for file uploads and BullMQ for job queueing.

- **Unit Tests** (`backend/tests/unit/worker.test.js`):
  - Tests the log processing worker functionality.
  - Mocks dependencies such as fs, readline, Supabase, WebSocket, and Redis.
  - Verifies that the worker processes log files correctly and sends progress updates via WebSocket.

### Running Tests

To run the tests, execute the following command in the backend directory:

```bash
npm test
```

## Login Page

The Login Page is the entry point for users to access the application. It provides two authentication methods:

- **Email/Password Authentication**: Users can log in using their email and password. Supabase handles the authentication process. On successful login, users are redirected to the Upload Logs page.
- **GitHub OAuth Authentication**: Users can log in using their GitHub account. Supabase handles the OAuth flow. On successful login, users are redirected to the Upload Logs page.

### Features of the Login Page:

- **Form Validation**: Ensures that users enter valid email and password combinations.
- **Error Handling**: Displays error messages if authentication fails.
- **GitHub OAuth Integration**: Allows users to log in with their GitHub account seamlessly.
- **Redirection**: After successful authentication, users are redirected to the Upload Logs page to start uploading and processing log files.

### Example Login Flow:

1. User visits the login page (http://localhost:3001/login).
2. User enters their email and password or clicks "Sign in with GitHub."
3. On successful authentication, the user is redirected to the Upload Logs page (http://localhost:3001).
4. The user can now upload log files and view processed data.



