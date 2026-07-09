.PHONY: start-all start-all-dev start-auth start-notif start-project start-task start-auth-dev start-notif-dev start-project-dev start-task-dev

# Run all services concurrently using Make's -j flag
start-all:
	@echo "Starting all backend services..."
	$(MAKE) -j4 start-auth start-notif start-project start-task

# Run all services concurrently in watch/dev mode
start-all-dev:
	@echo "Starting all backend services in dev mode..."
	$(MAKE) -j4 start-auth-dev start-notif-dev start-project-dev start-task-dev

# Standard start commands
start-auth:
	cd backend && npm run start authentication

start-notif:
	cd backend && npm run start notifications

start-project:
	cd backend && npm run start project-management

start-task:
	cd backend && npm run start task-management

# Dev/watch start commands
start-auth-dev:
	cd backend && npm run start:dev authentication

start-notif-dev:
	cd backend && npm run start:dev notifications

start-project-dev:
	cd backend && npm run start:dev project-management

start-task-dev:
	cd backend && npm run start:dev task-management
