# LF-backend-todo Assignment (Day 3)

This project is a backend service built using Node.js, Express, and TypeScript. It includes JWT authentication and CRUD operations for managing users and tasks.

Day 3 tasks consists of updating the apis to include login, authentication middleware using jwt and updates to existing routes.

## Day3 tasks

1. Add a default super admin user in the users array. Create CRUD routes for users and only the super admin user should have access to those routes.
2. Each new created user should be able to do CRUD operations on their to do items only.
3. Each of the response must have a proper HTTP status code
4. Add error handlers and appropriate errors for all cases
5. Add loggers appropriately for all routes

## Table of Contents

- [LF-backend-todo Assignment (Day 3)](#lf-backend-todo-assignment-day-3)
  - [Day3 tasks](#day3-tasks)
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
  - [Defualt Admin](#defualt-admin)
  - [Available Routes and Data](#available-routes-and-data)
    - [User Routes](#user-routes)
      - [Get User Info by ID](#get-user-info-by-id)
      - [Get All User Info](#get-all-user-info)
      - [Create User](#create-user)
      - [Update User (NOT authenticated)](#update-user-not-authenticated)
      - [Delete User (NOT authenticated)](#delete-user-not-authenticated)
    - [Authentication Routes](#authentication-routes)
      - [Login](#login)
      - [Refresh Token](#refresh-token)
    - [Task Routes](#task-routes)
      - [Get All Tasks](#get-all-tasks)
      - [Get Task by ID](#get-task-by-id)
      - [Create Task](#create-task)
      - [Update Task by ID](#update-task-by-id)
      - [Delete Task by ID](#delete-task-by-id)
  - [Folder Structure](#folder-structure)

## Installation

1. Clone the repository with day3 branch:

```bash
git clone -b day3 https://github.com/Nisan-Shrestha/LF-backend-todo.git
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
PORT=<PORT_NO>  # Default: 8000
JWT_SECRET=<JWT_SECRET>
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

- Triggers on push or pull request to the `day3` branch. (Also other day specific branches)
- Logs in to Docker Hub.
- Builds and pushes the Docker image to Docker Hub.

### Docker Image

[Docker Hub Repo: https://hub.docker.com/r/akamart/lf-be-todo-d3](https://hub.docker.com/r/akamart/lf-be-todo-d3)

- Docker pull command:

```bash
docker pull akamart/lf-be-todo-d3
```

- Make a .env file in your current directory using the provided .env.example template.

- Run docker image:

```bash
docker run --env-file .env -p 8000:8000 akamart/lf-be-todo-d3
```

## Defualt Admin

A defualt admin with email: `admin@gmail.com` and pw: `Admin123` exists for now.
Only Admin has access to User Routes.

## Available Routes and Data

### User Routes

ALl user routes are authenicated and authorised only to the Default Admin

#### Get User Info by ID

- **Route:** `GET /users/:id`
- **Handler Function:** `getUserInfo`
- **Description:** Retrieves user information based on a provided ID.
- **Request Parameters:**
  - `id`: The ID of the user to retrieve.
- **Response Data:** JSON containing user information.

#### Get All User Info

- **Route:** `GET /users`
- **Handler Function:** `getAllUser`
- **Description:** Retrieves user information based on a provided ID.
- **Response Data:** Array of JSON containing all user information.

#### Create User

- **Route:** `POST /users`
- **Handler Function:** `createUser`
- **Description:** Creates a new user.
- **Request Body:**
  - `email`: The email of the user.
  - `password`: The password of the user.
  - `name`: The name of the user.
- **Response Data:** JSON containing success message and user data.

#### Update User (NOT authenticated)

- **Route:** `PUT /users`
- **Handler Function:** `updateUser`
- **Description:** Updates user information.
- **Query Parameters:**
  - `id`: The ID of the user to update.
- **Request Body:** Partial user data to update.
- **Response Data:** JSON containing updated user information.

#### Delete User (NOT authenticated)

- **Route:** `DELETE /users`
- **Handler Function:** `deleteUser`
- **Description:** Deletes a user.
- **Query Parameters:**
  - `id`: The ID of the user to delete.
- **Response Data:** JSON containing success message.

### Authentication Routes

#### Login

- **Route:** `POST /auth/login`
- **Handler Function:** `login`
- **Description:** Authenticates a user and returns access and refresh tokens.
- **Request Body:**
  - `email`: The email of the user.
  - `password`: The password of the user.
- **Response Data:** JSON containing access and refresh tokens.

#### Refresh Token

- **Route:** `POST /auth/refresh`
- **Handler Function:** `refresh`
- **Description:** Refreshes the access token using the refresh token.
- **Request Headers:**
  - `Authorization`: The refresh token in the format `Bearer <token>`.
- **Response Data:** JSON containing new access and the current refresh tokens.

### Task Routes

All Task routes are authenticated and require Authorization token in the request headers.

#### Get All Tasks

- **Route:** `GET /task`
- **Handler Function:** `getAllTasks`
- **Description:** Retrieves all tasks for the authenticated user.
- **Request Headers:**
  - `Authorization`: The access token in the format `Bearer <token>`.
- **Response Data:** JSON array of tasks concering the authenticated user.

#### Get Task by ID

- **Route:** `GET /task/:id`
- **Handler Function:** `getTaskById`
- **Description:** Retrieves a task by its ID for the authenticated user.
- **Request Headers:**
  - `Authorization`: The access token in the format `Bearer <token>`.
- **Request Parameter:**
  - `id`: The ID of the task to retrieve.
- **Response Data:** JSON containing task details.

#### Create Task

- **Route:** `POST /task`
- **Handler Function:** `createTask`
- **Description:** Creates a new task for the authenticated user.
- **Request Headers:**
  - `Authorization`: The access token in the format `Bearer <token>`.
- **Request Body:**
  - `detail`: The detail of the task.
- **Response Data:** JSON containing created task.

#### Update Task by ID

- **Route:** `PUT /task/:id`
- **Handler Function:** `updateTaskById`
- **Description:** Updates a task by its ID for the authenticated user.
- **Request Headers:**
  - `Authorization`: The access token in the format `Bearer <token>`.
- **Request Parameter:**
  - `id`: The ID of the task to update.
- **Query Parameters:**
  - `update`: Required update type: (`detail` or `status`)
- **Request Body:**
  - `detail`: The new detail of the task.
  - `status`: The new status of the task (`pending` or `done`).
- **Response Data:** JSON containing updated task.

#### Delete Task by ID

- **Route:** `DELETE /task/:id`
- **Handler Function:** `deleteTaskById`
- **Description:** Deletes a task by its ID for the authenticated user.
- **Request Headers:**
  - `Authorization`: The access token in the format `Bearer <token>`.
- **Request Parameter:**
  - `id`: The ID of the task to delete.
- **Response Data:** JSON containing success message.

## Folder Structure

```bash
.
├── Dockerfile
├── .dockerignore
├── .env
├── .github
│   └── workflows
│       └── deploy.yml
├── .gitignore
├── package.json
├── readme.md
└── src
    ├── app.ts
    ├── config.ts
    ├── controller
    │   ├── Auth.ts
    │   ├── Task.ts
    │   └── User.ts
    ├── data
    │   ├── tasks.json
    │   └── users.json
    ├── interfaces
    │   ├── Task.ts
    │   └── User.ts
    ├── middleware
    │   └── auth.ts
    ├── models
    │   ├── Task.ts
    │   └── User.ts
    ├── routes
    │   ├── Auth.ts
    │   ├── index.ts
    │   ├── Task.ts
    │   └── User.ts
    └── services
        ├── Auth.ts
        ├── Task.ts
        └── User.ts
```
