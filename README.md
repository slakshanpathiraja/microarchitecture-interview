# Microservices Backend

| Service Name       | Port | Dev Server Start Command                     |
| ------------------ | ---- | -------------------------------------------- |
| Authentication     | 4001 | `npm run start:dev authentication`           |
| Project Management | 4002 | `npm run start:dev project-management`       |
| Task Management    | 4003 | `npm run start:dev task-management`          |
| Notifications      | 4004 | `npm run start:dev notifications`            |

## API Documentation & WebSockets

| Service Name       | Swagger/API URL                  | Base API Path | Type        |
| ------------------ | -------------------------------- | ------------- | ----------- |
| Authentication     | [http://localhost:4001/swagger](http://localhost:4001/swagger) | `/api/v1`     | REST API    |
| Project Management | [http://localhost:4002/swagger](http://localhost:4002/swagger) | `/api/v1`     | REST API    |
| Task Management    | [http://localhost:4003/swagger](http://localhost:4003/swagger) | `/api/v1`     | REST API    |
| Notifications      | [http://localhost:4004/swagger](http://localhost:4004/swagger) (also `ws://`)| `/api/v1`     | WebSocket/REST|

For the REST APIs, you can access their interactive Swagger UI by navigating to the URLs provided in the table above.

For the **Notifications** service, it has been configured as a **Socket.IO WebSocket Server**. You can connect your Socket.IO client directly to `http://localhost:4004`.
