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

## Screenshots

### Login/Register
<img width="1470" height="880" alt="Screenshot 2025-11-15 at 9 49 56 PM" src="https://github.com/user-attachments/assets/96c22457-752c-4d3a-8ac2-df474b8c1e95" />
<img width="1470" height="879" alt="Screenshot 2025-11-15 at 9 50 12 PM" src="https://github.com/user-attachments/assets/16b672f2-a606-46de-9127-ad5fd46ffd6b" />

### Dashboard with Tickets' Search & Filter
<img width="1470" height="878" alt="Screenshot 2025-11-15 at 9 51 25 PM" src="https://github.com/user-attachments/assets/3e27f824-ea43-4565-9cc3-6734709b7c98" />

### Create Ticket
<img width="1470" height="879" alt="Screenshot 2025-11-15 at 9 53 34 PM" src="https://github.com/user-attachments/assets/ae65bf0a-fac3-406d-8bf4-9e91a25498f1" />

### Ticket Details with File Attachments & Comments
<img width="1470" height="878" alt="Screenshot 2025-11-15 at 9 58 58 PM" src="https://github.com/user-attachments/assets/64881919-940e-4947-80e2-0332dee49b18" />

### Edit Ticket
<img width="1470" height="880" alt="Screenshot 2025-11-15 at 10 00 34 PM" src="https://github.com/user-attachments/assets/6d6aafc6-3776-4d3a-9367-f78a6f9d37dd" />

### User Management
<img width="1470" height="878" alt="Screenshot 2025-11-15 at 10 01 15 PM" src="https://github.com/user-attachments/assets/33a04271-fee1-400e-b154-a436e0fc6688" />
