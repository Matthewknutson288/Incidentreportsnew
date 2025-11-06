# Environment Variables Setup Guide

This guide explains how to set up environment variables for the Incident Reports application.

## 🔐 Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

### Required Variables

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Example:**
```env
MONGO_URI=mongodb+srv://matthewknutson288:password@incidentreport.vsslqlw.mongodb.net/incidentreports?appName=Incidentreport
```

### Optional Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
MANAGER_EMAIL=manager@company.com
```

## 🌐 Frontend Environment Variables

Create a `.env` file in the `frontend` directory (optional for local development):

```env
VITE_API_URL=http://localhost:5000
```

**Note:** If `VITE_API_URL` is not set, the frontend will use `window.location.origin` as the API URL.

## 📋 MongoDB Connection String Format

Your MongoDB connection string should follow this format:

```
mongodb+srv://[username]:[password]@[cluster].mongodb.net/[database]?[options]
```

### Connection String Components:

1. **Protocol**: `mongodb+srv://` (for MongoDB Atlas)
2. **Username**: Your MongoDB Atlas username
3. **Password**: Your MongoDB Atlas password (URL-encode special characters)
4. **Cluster**: Your MongoDB Atlas cluster URL
5. **Database**: Your database name
6. **Options**: Query parameters (optional)
   - `retryWrites=true` - Enable retryable writes
   - `w=majority` - Write concern
   - `appName=YourAppName` - Application name for monitoring

### Example Connection Strings:

**Basic:**
```
mongodb+srv://user:pass@cluster.mongodb.net/incidentreports
```

**With Options:**
```
mongodb+srv://user:pass@cluster.mongodb.net/incidentreports?retryWrites=true&w=majority&appName=IncidentReport
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** - They are already in `.gitignore`
2. **Use environment-specific values** - Different values for development and production
3. **Use app passwords** - For Gmail, use an app-specific password instead of your regular password
4. **Rotate credentials regularly** - Change passwords periodically
5. **Use MongoDB Atlas IP whitelisting** - Restrict database access to specific IP addresses

## 🚀 Deployment Environment Variables

When deploying to platforms like Render, Vercel, or Netlify, set these environment variables in the platform's dashboard:

### Render (Backend)
- `MONGO_URI`
- `NODE_ENV=production`
- `PORT` (usually auto-set by Render)
- `EMAIL_USER` (optional)
- `EMAIL_PASS` (optional)
- `MANAGER_EMAIL` (optional)

### Vercel/Netlify (Frontend)
- `VITE_API_URL` - Your backend API URL (e.g., `https://your-backend.onrender.com`)

## ✅ Verification

To verify your environment variables are set correctly:

### Backend
```bash
cd backend
node -e "require('dotenv').config(); console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not Set');"
```

### Frontend
```bash
cd frontend
node -e "console.log('Check your .env file or environment variables')"
```

## 🐛 Common Issues

### MongoDB Connection Fails
- **Issue**: Connection string is incorrect
- **Solution**: Double-check username, password, cluster URL, and database name
- **Issue**: IP address not whitelisted
- **Solution**: Add your IP address in MongoDB Atlas Network Access

### Email Not Sending
- **Issue**: Email credentials incorrect
- **Solution**: Verify `EMAIL_USER` and `EMAIL_PASS` are correct
- **Issue**: Using Gmail regular password
- **Solution**: Use an app-specific password from Google Account settings

### Frontend Can't Connect to Backend
- **Issue**: `VITE_API_URL` not set or incorrect
- **Solution**: Set `VITE_API_URL` to your backend URL (e.g., `http://localhost:5000` for local development)

