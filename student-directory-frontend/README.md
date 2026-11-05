# Student Directory – React Frontend

## Project Description

The Student Directory is a React application connected to a secure backend API. It allows users to register, log in, and view student records using JWT authentication.

## Features

- User registration
- User login
- JWT authentication
- Protected Students page
- Display student records from the API
- Logout functionality
- Automatic redirect for unauthenticated users

## Technologies Used

- React
- Vite
- React Router DOM
- JavaScript
- CSS
- Express.js
- MongoDB
- JWT

## Project Structure

```text
student-directory-frontend/
├── screenshots/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useAuth.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Students.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
└── README.md
```

## Installation

1. Clone or download the project.
2. Open the frontend folder in VS Code.
3. Install dependencies:

```bash
npm install
```

4. Install React Router:

```bash
npm install react-router-dom
```

## Running the Application

### Start the Backend

Open a terminal in the backend folder:

```bash
cd user-directory
npm start
```

The backend runs at:

`http://localhost:3000`

### Start the Frontend

Open another terminal:

```bash
cd student-directory-frontend
npm run dev
```

Open the application at:

`http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register an account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/students` | Retrieve students (protected) |

## Authentication

The application uses JSON Web Tokens (JWT) to authenticate users. After a successful login, the token is stored in localStorage and included in protected API requests through the Authorization header.

The frontend uses AuthContext to manage authentication state and ProtectedRoute to restrict access to protected pages.

## Screenshots

The screenshots folder contains evidence of the application:

1. Login page
2. Registration page
3. Successful login and Students page
4. Failed login
5. Protected route redirect
6. JWT Authorization request

## Reflection Questions

### 1. Why do we store the token in localStorage? What is one security risk of doing so, and what is a more secure alternative?

We store the JWT in localStorage so the frontend can keep the user's login session even after the browser page is refreshed. It allows the application to retrieve the token and include it in requests to protected API endpoints. However, one security risk is Cross-Site Scripting (XSS), because malicious JavaScript running on the page could access and steal the token. A more secure alternative is storing the token in an HttpOnly, Secure, and appropriately configured SameSite cookie, which JavaScript cannot directly access.

### 2. What is the purpose of AuthContext? Why not just pass the token as a prop to each component?

The purpose of AuthContext is to manage authentication information, such as the user's token, user details, login function, and logout function, in one shared location. It allows components like Login, Students, and ProtectedRoute to access authentication information without passing props through multiple components. This avoids a problem called prop drilling, which makes code harder to maintain. Using Context API also makes authentication state easier to update and manage throughout the application.

### 3. What happens on the frontend when the JWT expires? Describe the user experience you would want to implement.

When the JWT expires, the backend should reject protected API requests because the token is no longer valid. The frontend should detect an unauthorized response, such as HTTP 401, remove the expired token from localStorage, and clear the user's authentication state. The application should then redirect the user to the login page with a message explaining that their session has expired. I would also provide a convenient way for the user to log in again and continue using the application.

### 4. What is the difference between the backend's requireAuth middleware and the frontend's ProtectedRoute component? Why do we need both?

The backend's requireAuth middleware checks the JWT sent with an API request and verifies whether the user is authorized to access protected backend resources. The frontend's ProtectedRoute component checks whether a user has an authentication token before allowing access to pages such as the Students page. We need both because frontend route protection controls the user interface, while backend middleware provides actual API security. Without backend protection, users could bypass the frontend and directly access protected API endpoints.

