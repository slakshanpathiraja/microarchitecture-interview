# Microservices Backend

| Service Name       | Port | Dev Server Start Command                     |
| ------------------ | ---- | -------------------------------------------- |
| Authentication     | 4001 | `npm run start:dev authentication`           |
| Project Management | 4002 | `npm run start:dev project-management`       |
| Task Management    | 4003 | `npm run start:dev task-management`          |
| Notifications      | 4004 | `npm run start:dev notifications`            |

## API Documentation & WebSockets

For your REST APIs (Authentication, Project Management, Task Management), you can access their Swagger UI by navigating to:
`http://localhost:<PORT>/api`

For the **Notifications** service (Port 4004), it has been configured as a **Socket.IO WebSocket Server**. You can connect your Socket.IO client directly to `http://localhost:4004`.
