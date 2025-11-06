# Incident Reports Management System

A full-stack application for managing employee incident reports with point tracking, Excel import/export, and email notifications.

## 🚀 Features

- **Incident Reporting**: Create, view, edit, and delete incident reports
- **Employee Management**: Track employee points and status
- **Point System**: Automatic point calculation based on incident types
- **Excel Integration**: Import and export incident reports via Excel
- **Email Notifications**: Automated write-up and termination notifications
- **Responsive Design**: Works on desktop and mobile devices

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## ⚙️ Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development

# Optional: Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
MANAGER_EMAIL=manager@company.com
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `frontend` directory (optional for local development):
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

### 3. MongoDB Connection

Make sure your MongoDB connection string is correctly formatted:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Important Notes:**
- Replace `username` and `password` with your MongoDB Atlas credentials
- Replace `cluster.mongodb.net` with your actual cluster URL
- Replace `database` with your database name
- The connection string should be URL-encoded if it contains special characters

## 📁 Project Structure

```
.
├── backend/           # Express.js backend API
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── services/     # Email service
│   ├── utils/        # Utility functions
│   └── scripts/      # Utility scripts
├── frontend/         # React frontend application
│   └── src/
│       ├── components/  # React components
│       └── config/      # API configuration
└── netlify/         # Netlify serverless functions
```

## 🔧 Available Scripts

### Backend
- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to Render, Vercel, or other platforms.

## 📝 Environment Variables

### Backend (.env)
- `MONGO_URI` - MongoDB connection string (required)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `EMAIL_USER` - Email for notifications (optional)
- `EMAIL_PASS` - Email password/app password (optional)
- `MANAGER_EMAIL` - Manager email for notifications (optional)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (optional, defaults to window.location.origin)

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB connection string is correct
- Check that your IP address is whitelisted in MongoDB Atlas
- Ensure your MongoDB Atlas cluster is running
- Verify your database user has proper permissions

### Port Already in Use
- Change the PORT in the backend `.env` file
- Update the frontend `VITE_API_URL` to match the new port

## 📄 License

ISC

## 👤 Author

Matthew Knutson
