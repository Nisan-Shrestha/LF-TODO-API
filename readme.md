# LF-backend-todo (DAY1)

LF-backend-todo is a simple backend service for managing a todo list. It is built using Node.js, Express, and TypeScript, and it includes Docker support for easy deployment.
DAY-1 consists of few simple api routes.

## Assignment Tasks

- Create a basic CRUD ToDo app API with Node.js and Express

## Table of Contents

- [LF-backend-todo (DAY1)](#lf-backend-todo-day1)
  - [Assignment Tasks](#assignment-tasks)
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

[Docker Hub Repo: https://hub.docker.com/r/akamart/lf-be-todo-d1](https://hub.docker.com/r/akamart/lf-be-todo-d1)

- Docker pull command:

```bash
docker pull akamart/lf-be-todo-d1
```

- Make a .env file in your current directory using the provided .env.example template.

- Run docker image:

```bash
docker run --env-file .env -p 8000:8000 akamart/lf-be-todo-d1
```

## Available Routes and Data

### Get All Tasks

- **Route:** `GET /task`
- **Handler Function:** `getAllTasks`
- **Description:** Retrieves all tasks.
- **Response Data:** A array of json of all tasks.

### Get Task by ID

- **Route:** `GET /task/:id`
- **Handler Function:** `getTaskById`
- **Description:** Retrieves a task by its ID.
- **Request Parameter:**
  - `id`: The ID of the task to retrieve.
- **Response Data:** The task JSON with the specified ID.

### Create Task

- **Route:** `POST /task`
- **Handler Function:** `createTask`
- **Description:** Creates a new task.
- **Request Body:**
  - `detail`: The detail of the task to create. Request must be raw json with { "detail" : "\<taskdetail>" }.
- **Response Data:** JSON of created task

### Update Task by ID

- **Route:** `PUT /task/:id`
- **Handler Function:** `updateTaskById`
- **Description:** Updates an existing task by its ID.
- **Request Parameter:**
  - `id`: The ID of the task to update.
- **Request Body:** The new details of the task to update. <br> Request must be raw json with { "detail" : "\<taskdetail>" , "status" : <"pending" or "done"> }. <br>Either field maybe omitted.
- **Response Data:** JSON of updated task.

### Delete Task by ID

- **Route:** `DELETE /task/:id`
- **Handler Function:** `deleteTaskById`
- **Description:** Deletes a task by its ID.
- **Request Parameter:**
  - `id`: The ID of the task to delete.
- **Response Data:** JSON of id of task deleted.

## Example Usage

- **Get All Tasks**

  ```bash
  curl -X GET http://localhost:8000/task
  ```

- **Get Task by ID**

  ```bash
  curl -X GET http://localhost:8000/task/{id}
  ```

- **Create Task**

  ```bash
  curl -X POST http://localhost:8000/task -H "Content-Type: application/json" -d '{"detail": "New Task"}'
  ```

- **Update Task by ID**

  ```bash
  curl -X PUT http://localhost:8000/task/{id} -H "Content-Type: application/json" -d '{"detail": "Updated Task", "status": "completed"}'
  ```

- **Delete Task by ID**

  ```bash
  curl -X DELETE http://localhost:8000/task/{id}
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
