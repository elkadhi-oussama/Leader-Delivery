# MERN E-Commerce Website

A full-stack e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User authentication and authorization
- Product catalog with categories
- Shopping cart functionality
- Order management
- Admin dashboard
- Responsive design

## Project Structure

```
ecommerce/
├── client/             # React frontend
├── server/             # Node.js backend
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Technologies Used

- Frontend:
  - React.js
  - Redux Toolkit
  - Material-UI
  - Axios
  - React Router

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT Authentication
  - bcryptjs

## License

MIT 