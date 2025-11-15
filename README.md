# Ticketing System

A full-stack ticketing system with a Spring Boot backend and a Next.js frontend.

## Description

This is a comprehensive ticketing system that allows users to create, manage, and track support tickets. It provides different roles for users, including regular users, support agents, and administrators.

## Technologies Used

### Backend

*   Java
*   Spring Boot
*   Spring Security
*   JPA (Hibernate)
*   PostgreSQL

### Frontend

*   Next.js
*   React
*   Tailwind CSS
*   Framer Motion
*   TypeScript

## Getting Started

### Prerequisites

*   Java 17 or later
*   Node.js 18 or later
*   npm
*   PostgreSQL

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Muskan244/Ticketing_System.git
    ```

2.  **Backend Setup:**

    *   Navigate to the `src/main/resources` directory.
    *   Update the `application.properties` file with your PostgreSQL database credentials.
    *   Build the backend project using Gradle:

        ```bash
        ./gradlew build
        ```

3.  **Frontend Setup:**

    *   Navigate to the `frontend` directory.
    *   Install the dependencies:

        ```bash
        npm install
        ```

### Running the Application

1.  **Run the backend:**

    ```bash
    ./gradlew bootRun
    ```

    The backend server will start on `http://localhost:8080`.

2.  **Run the frontend:**

    ```bash
    npm run dev
    ```

    The frontend development server will start on `http://localhost:3000`.

## Features

*   User authentication and authorization with JWT.
*   Role-based access control (USER, SUPPORT_AGENT, ADMIN).
*   Create, view, update, and delete tickets.
*   Add comments to tickets.
*   Attach files to tickets.
*   Filter tickets by subject, status, and priority.
*   Assign tickets to support agents.
*   Rate resolved tickets.
*   Admin dashboard for user management.

## API Endpoints

### User Controller (`/api/users`)

| Method | Endpoint            | Description              | Access Control      |
|--------|---------------------|--------------------------|---------------------|
| `PUT`  | `/{id}/role`        | Update a user's role     | `ADMIN`             |
| `DELETE`| `/{id}`             | Delete a user            | `ADMIN`             |
| `GET`  | `/me`               | Get the current user     | `isAuthenticated()` |
| `GET`  | `/`                 | Get all users            | `ADMIN`             |
| `POST` | `/register`         | Register a new user      | `permitAll()`       |

### Ticket Controller (`/api/tickets`)

| Method | Endpoint            | Description              | Access Control      |
|--------|---------------------|--------------------------|---------------------|
| `POST` | `/`                 | Create a new ticket      | `isAuthenticated()` |
| `GET`  | `/`                 | Get all tickets          | `isAuthenticated()` |
| `PUT`  | `/{id}`             | Update a ticket          | `ADMIN`, `SUPPORT_AGENT` |
| `GET`  | `/{id}`             | Get a ticket by ID       | `ADMIN`, `SUPPORT_AGENT`, `OWNER` |
| `POST` | `/{id}/rate`        | Rate a ticket            | `isAuthenticated()` |

### Comment Controller (`/api/tickets/{ticketId}/comments`)

| Method | Endpoint            | Description              | Access Control      |
|--------|---------------------|--------------------------|---------------------|
| `POST` | `/`                 | Create a new comment     | `ADMIN`, `SUPPORT_AGENT`, `OWNER` |

### Attachment Controller (`/api`)

| Method | Endpoint                            | Description              | Access Control      |
|--------|-------------------------------------|--------------------------|---------------------|
| `POST` | `/tickets/{ticketId}/attachments`   | Upload a file            | `isAuthenticated()` |
| `GET`  | `/attachments/{attachmentId}`       | Download a file          | `isAuthenticated()` |

