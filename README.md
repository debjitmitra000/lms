# Lead Management System

A full-stack web application for managing leads with user authentication, CRUD operations, and modern React frontend.

## 🚀 Tech Stack

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- bcryptjs for password hashing
- Express Validator for input validation

**Frontend:**
- React 19.1.1 with Vite
- React Router DOM for navigation
- Tailwind CSS for styling
- Axios for API requests

## 📁 Project Structure

```
lms/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── .env
└── README.md
```

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register  # User registration
POST /api/auth/login     # User login
POST /api/auth/logout    # User logout
GET /api/auth/me         # Get current user
```

### Leads
```
POST /api/leads          # Create a new lead
GET /api/leads           # Get all leads (with pagination & filters)
GET /api/leads/:id       # Get single lead
PUT /api/leads/:id       # Update lead
DELETE /api/leads/:id    # Delete lead
```

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### 1. Clone the repository
```bash
git clone https://github.com/debjitmitra000/lms
cd lms
```

### 2. Install dependencies

**Backend dependencies:**
```bash
cd backend
npm install
```

**Frontend dependencies:**
```bash
cd ../frontend
npm install
```

### 3. Environment Variables

**Backend (.env file in backend directory):**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority&appName=lms
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env file in frontend directory):**
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Database Setup

**Using MongoDB Atlas:**
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace the MONGODB_URI in your backend .env file

**Using Local MongoDB:**
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/leadmanagement`

The application will create collections automatically on first run.

### 5. Seed Database (Optional)

You can populate your database with sample data using the provided seed scripts:

```bash
cd backend

# Seed sample users
npm run seed:users

# Seed sample leads
npm run seed:leads

# Seed users with their associated leads
npm run seed:user-leads
```

## 🚀 Running the Application

### Development Mode

**Option 1: Run both services separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

**Option 2: Run from root directory** (if you have concurrent setup)
```bash
npm run dev
```

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📊 Available Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed:users` - Seed sample users
- `npm run seed:leads` - Seed sample leads
- `npm run seed:user-leads` - Seed users with associated leads

### Frontend Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Access Points

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api

## 🔧 Key Dependencies

### Backend
- **express**: ^5.1.0 - Web framework
- **mongoose**: ^8.18.0 - MongoDB ODM
- **jsonwebtoken**: ^9.0.2 - JWT authentication
- **bcryptjs**: ^3.0.2 - Password hashing
- **express-validator**: ^7.2.1 - Input validation
- **cors**: ^2.8.5 - CORS handling
- **cookie-parser**: ^1.4.7 - Cookie parsing
- **dotenv**: ^17.2.1 - Environment variables

### Frontend
- **react**: ^19.1.1 - UI library
- **react-dom**: ^19.1.1 - DOM bindings
- **react-router-dom**: ^7.8.1 - Client-side routing
- **tailwindcss**: ^4.1.12 - CSS framework
- **axios**: ^1.11.0 - HTTP client
- **vite**: ^7.1.2 - Build tool
