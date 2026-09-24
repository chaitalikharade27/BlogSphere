# BlogSphere

BlogSphere is a full-stack blogging application built using a **Spring Boot** backend and a **React (Vite)** frontend. It allows users to register, log in, create, edit, like, and delete blog posts with images, as well as comment on posts. The backend is secured using JWT authentication.

## Features

- **User Authentication**: Secure registration and login using JWT (JSON Web Tokens).
- **Create & Edit Posts**: Authenticated users can create posts with an image, title, content, and category.
- **Image Uploads**: File uploading support with multipart form data.
- **Interactions**: Users can like and comment on posts.
- **Search & Filter**: Search posts by keywords and filter by categories.
- **Role-Based Access Control**: Different access levels for standard users and admins.

## Tech Stack

### Backend
- **Java 17** & **Spring Boot**
- **Spring Security** & **JWT** for authentication
- **Spring Data JPA** & **Hibernate**
- **MySQL** Database

### Frontend
- **React** (via Vite)
- **Axios** for API requests
- Custom CSS for styling

## Prerequisites

- **Java 17** or higher
- **Node.js** (v16+) and **npm**
- **MySQL** running locally or via Docker

## Getting Started

### 1. Setup the Backend

1. Navigate to the backend directory:
   ```bash
   cd blogging-system
   ```
2. Create a `.env` file in the `blogging-system` directory and configure your credentials:
   ```properties
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   JWT_SECRET=your_super_secret_jwt_key_that_is_long_enough
   ```
3. Ensure you have a MySQL server running on `localhost:3306`. The application will automatically create the database `blogging_system` if it does not exist.
4. Start the Spring Boot application using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

### 2. Setup the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd blogging-system/frontend
   ```
2. Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or the port specified by Vite).

## API Endpoints Overview

- **Auth**: `/api/auth/login`, `/api/auth/register`
- **Posts**: `/api/posts` (GET, POST, PUT, DELETE)
- **Comments**: `/api/posts/{postId}/comments` (GET, POST)
- **Users**: `/api/users/me`

## Security Considerations

- **Environment Variables**: Sensitive data such as database credentials and JWT secrets are managed via `.env` files and should **never** be committed to version control.
- **Stateless Authentication**: Uses stateless JWT authentication, ensuring no server-side sessions are stored.
