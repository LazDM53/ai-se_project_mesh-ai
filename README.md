# MeshAI

MeshAI is a full-stack AI assistant that lets users upload documents to a knowledge base and ask questions about their content through a chat interface. It uses retrieval-augmented generation (RAG) to help users find relevant information from their documents.

**Live application:** https://mytodoapp.24-7.ro

**Repository:** https://github.com/LazDM53/ai-se_project_mesh-ai

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **AI integration:** Nebius AI API
- **Containerization:** Docker, Docker Compose
- **Web server and reverse proxy:** Caddy
- **Cloud hosting:** AWS EC2
- **Continuous integration:** GitHub Actions

## Getting Started

### Prerequisites

Install the following on your machine:

- [Node.js 20 or later](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine with the Docker Compose plugin
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/LazDM53/ai-se_project_mesh-ai.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ai-se_project_mesh-ai
   ```

3. Create your environment file from the example:

   **Linux/macOS:**
   ```bash
   cp .env.example .env
   ```

   **Windows PowerShell:**
   ```powershell
   Copy-Item .env.example .env
   ```

4. Open `.env` and provide the required environment variable values. Do not commit real secrets or API keys to version control.

5. Build and start the application using Docker Compose:

   ```bash
   docker compose up --build -d
   ```

6. Open the application in your browser. For local development, use the local address configured for Caddy in your `.env` file.

To stop the application, run:

```bash
docker compose down
```

To view container logs, run:

```bash
docker compose logs -f
```

## Environment Variables

Configure the following variables in your `.env` file:

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection string used by the backend. When running through Docker Compose, this should point to the MongoDB service. |
| `JWT_SECRET` | Secret used to sign and verify authentication tokens. Use a strong, private value. |
| `NEBIUS_API_KEY` | API key used to access the Nebius AI service. |
| `SITE_ADDRESS` | Hostname or address Caddy uses to serve the application. Configure this appropriately for local development or production. |

## Deployment

The application is containerized with Docker Compose and deployed on AWS EC2. Caddy acts as the web server and reverse proxy, routing application traffic to the frontend and backend services.

GitHub Actions runs automated client and server validation as part of the continuous integration workflow.

## Security

- Never commit `.env` files, API keys, JWT secrets, or other credentials.
- Keep `.env.example` limited to variable names and safe placeholder values.
- Use a strong, unique `JWT_SECRET` outside development.
