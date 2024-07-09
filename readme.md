# LF-backend-todo

LF-backend-todo is a simple backend service for managing a todo list. It is built using Node.js, Express, and TypeScript, and it includes Docker support for easy deployment.

## Table of Contents

- [LF-backend-todo](#lf-backend-todo)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Configuration](#configuration)
  - [Development](#development)
    - [Main Files](#main-files)
    - [Scripts](#scripts)
    - [Available Commands](#available-commands)
  - [Deployment](#deployment)
    - [CI/CD Pipeline](#cicd-pipeline)
    - [Docker Image](#docker-image)
  - [Available Routes and Data](#available-routes-and-data)
    - [Get All Tasks](#get-all-tasks)
    - [Get Task by ID](#get-task-by-id)
    - [Create Task](#create-task)
    - [Update Task by ID](#update-task-by-id)
    - [Delete Task by ID](#delete-task-by-id)
  - [Example Usage](#example-usage)
  - [Folder Structure](#folder-structure)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Nisan-Shrestha/LF-backend-todo.git
cd LF-backend-todo
```

2. Install the dependencies:

```bash
npm install
```

3. Create a .env file based on the .env.example:

```bash
cp .env.example .env
```

Then env file looks like:

```bash
PORT=<PORT_NO> # 8000
```

The default port is 8000.

## Usage

To start the server in development mode with hot-reloading:

```bash
npm start
```

The server will start on the port specified in your .env file.

**For Docker image see:** [Docker Image](#docker-image)

## Configuration

The application can be configured using environment variables. Copy the `.env.example` file to `.env` and update the variables as needed.

## Development

### Main Files

- `src/app.ts`: Entry point of the application, where the Express server is set up.

### Scripts

- `start`: Starts the server with `nodemon` for hot-reloading during development.

### Available Commands

- `npm start`: Starts the server in development mode.

## Deployment

The project includes a GitHub Actions workflow for continuous integration and deployment.

### CI/CD Pipeline

The pipeline is defined in `deploy.yml`:

- Triggers on push or pull request to the `main` branch.
- Logs in to Docker Hub.
- Builds and pushes the Docker image to Docker Hub.

### Docker Image

[Docker Hub Repo: https://hub.docker.com/r/akamart/lf-be-todo](https://hub.docker.com/r/akamart/lf-be-todo)

- Docker pull command:

```bash
docker pull akamart/lf-be-todo
```

- Run docker image:

```bash
docker run -p 8000:8000 akamart/lf-be-todo
```

## Available Routes and Data

### Get All Tasks

- **Route:** `GET /tasks`
- **Handler Function:** `getAllTasks`
- **Description:** Retrieves all tasks.
- **Response Data:** A list of all tasks.

### Get Task by ID

- **Route:** `GET /tasks/:id`
- **Handler Function:** `getTaskById`
- **Description:** Retrieves a task by its ID.
- **Request Parameter:**
  - `id`: The ID of the task to retrieve.
- **Response Data:** The task object with the specified ID.

### Create Task

- **Route:** `POST /tasks`
- **Handler Function:** `createTask`
- **Description:** Creates a new task.
- **Request Body:**
  - `detail`: The detail of the task to create. Request must be raw json with { "detail" : "\<taskdetail>" }.
- **Response Data:** A message indicating the task was created, including the task's detail, ID, and status.

### Update Task by ID

- **Route:** `PUT /tasks/:id`
- **Handler Function:** `updateTaskById`
- **Description:** Updates an existing task by its ID.
- **Request Parameter:**
  - `id`: The ID of the task to update.
- **Request Body:** The new details of the task to update. <br> Request must be raw json with { "detail" : "\<taskdetail>" , "status" : <"pending" or "done"> }. <br>Either field maybe omitted.
- **Response Data:** A message indicating the task was updated, including the task's ID, status, and detail, or an error message if the update was unsuccessful.

### Delete Task by ID

- **Route:** `DELETE /tasks/:id`
- **Handler Function:** `deleteTaskById`
- **Description:** Deletes a task by its ID.
- **Request Parameter:**
  - `id`: The ID of the task to delete.
- **Response Data:** A message indicating the task was deleted, or an error message if the task was not found.

## Example Usage

- **Get All Tasks**

  ```bash
  curl -X GET http://localhost:8000/tasks
  ```

- **Get Task by ID**

  ```bash
  curl -X GET http://localhost:8000/tasks/{id}
  ```

- **Create Task**

  ```bash
  curl -X POST http://localhost:8000/tasks -H "Content-Type: application/json" -d '{"detail": "New Task"}'
  ```

- **Update Task by ID**

  ```bash
  curl -X PUT http://localhost:8000/tasks/{id} -H "Content-Type: application/json" -d '{"detail": "Updated Task", "status": "completed"}'
  ```

- **Delete Task by ID**

  ```bash
  curl -X DELETE http://localhost:8000/tasks/{id}
  ```

## Folder Structure

```bash
├── Dockerfile
├── .dockerignore
├── .env
├── .github
│   └── workflows
│       └── deploy.yml
├── .gitignore
├── package.json
├── package-lock.json
├── readme.md
└── src
    ├── app.ts
    ├── config.ts
    ├── controller
    │   └── Task.ts
    ├── interfaces
    │   └── Task.ts
    ├── models
    │   └── Task.ts
    ├── routes
    │   ├── index.ts
    │   └── Task.ts
    └── services
        └── Task.ts
```
