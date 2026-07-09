# Microservices Backend

## 🚀 1. Start Infrastructure (Docker)
Before running the backend code, start the necessary infrastructure (PostgreSQL, Redis, Nginx Gateway) using Docker. Run these commands from the root directory:

- **Start containers (background):** `docker compose up -d`
- **Stop containers:** `docker compose down`
- **Restart containers:** `docker compose restart`
- **View logs:** `docker compose logs -f`

## 💻 2. Start Microservices (NestJS)
Once Docker is running, you can start the backend services. You can start all of them concurrently from the root directory:
```bash
# Start all services
make start-all

# Start all services in watch/dev mode
make start-all-dev
```

### Individual Service Commands
| Service Name       | Port | Dev Server Start Command                     |
| ------------------ | ---- | -------------------------------------------- |
| Authentication     | 4001 | `npm run start:dev authentication`           |
| Project Management | 4002 | `npm run start:dev project-management`       |
| Task Management    | 4003 | `npm run start:dev task-management`          |
| Notifications      | 4004 | `npm run start:dev notifications`            |
| Audit Logging      | 4005 | `npm run start:dev audit`                    |

## API Documentation & WebSockets

| Service Name       | Swagger/API URL                  | Base API Path | Type        |
| ------------------ | -------------------------------- | ------------- | ----------- |
| Authentication     | [http://localhost:4001/swagger](http://localhost:4001/swagger) | `/api/v1`     | REST API    |
| Project Management | [http://localhost:4002/swagger](http://localhost:4002/swagger) | `/api/v1`     | REST API    |
| Task Management    | [http://localhost:4003/swagger](http://localhost:4003/swagger) | `/api/v1`     | REST API    |
| Notifications      | `ws://localhost:4004` (No Swagger) | N/A         | WebSocket   |
| Audit Logging      | [http://localhost:4005/swagger](http://localhost:4005/swagger) | `/api/v1`     | REST API    |

For the REST APIs, you can access their interactive Swagger UI by navigating to the URLs provided in the table above.

For the **Notifications** service, it has been configured as a **Socket.IO WebSocket Server**. You can connect your Socket.IO client directly to `http://localhost:4004`.

## 🔀 API Gateway Routing
The Nginx Gateway runs on port **4000** and routes external traffic to the internal microservices based on the URL path. Since Nginx is currently running in Docker while the services run locally, it uses `host.docker.internal` to route the traffic.

| Gateway Path | Routes To | Internal Port | Example Request |
| ------------ | --------- | ------------- | --------------- |
| `/authentication/` | Authentication | 4001 | `http://localhost:4000/authentication/api/v1/...` |
| `/project-management/` | Project Management | 4002 | `http://localhost:4000/project-management/api/v1/...` |
| `/task-management/` | Task Management | 4003 | `http://localhost:4000/task-management/api/v1/...` |
| `/ws/` | Notifications (WebSocket) | 4004 | `ws://localhost:4000/ws/...` |
| `/audit/` | Audit Logging | 4005 | `http://localhost:4000/audit/api/v1/...` |
