# Todo App

A modern, full-stack todo application built with React, TypeScript, and Node.js. Features user authentication, CRUD operations for todos, filtering, sorting, and a responsive design.

## Features

- ✅ **User Authentication** - Register, login, and logout functionality
- ✅ **Todo Management** - Create, read, update, and delete todos
- ✅ **Priority Levels** - Low, medium, and high priority todos
- ✅ **Due Dates** - Set and track due dates for todos
- ✅ **Filtering** - Filter todos by status (All, Active, Completed)
- ✅ **Sorting** - Sort todos by creation date, due date, priority, or title
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Modern UI** - Clean, intuitive interface with Tailwind CSS
- ✅ **Type Safety** - Full TypeScript support throughout the application

## Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Project Structure

```
todolist/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── todo/         # Todo-specific components
│   │   ├── auth/         # Authentication components
│   │   └── layout/       # Layout components
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── constants/        # Application constants
├── server/               # Backend server
│   ├── server.js         # Main server file
│   └── package.json      # Server dependencies
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd todolist
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Start the backend server**

   ```bash
   cd server
   npm run dev
   ```

5. **Start the frontend development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Todos

- `GET /api/todos` - Get all todos for the authenticated user
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `PATCH /api/todos/:id` - Toggle todo completion
- `DELETE /api/todos/:id` - Delete a todo

## Environment Variables

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
PORT=5000
NODE_ENV=development
```

## Usage

1. **Register/Login** - Create an account or sign in with existing credentials
2. **Create Todos** - Click "Add New Todo" to create a new task
3. **Manage Todos** - Edit, delete, or mark todos as complete
4. **Filter & Sort** - Use the filter buttons and sort options to organize your todos
5. **Set Priorities** - Assign low, medium, or high priority to your todos
6. **Due Dates** - Set due dates to track deadlines

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the database solution
- Express.js for the web framework
