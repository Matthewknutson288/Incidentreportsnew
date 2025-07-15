# Incident Reports App - Deployment Guide

## 🚀 Quick Deploy to Render (Recommended)

### Step 1: Prepare Your Repository
1. Push your code to GitHub
2. Make sure your MongoDB Atlas database is set up
3. Note your MongoDB connection string

### Step 2: Deploy Backend
1. Go to [Render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `incident-reports-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

5. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
   - `EMAIL_USER`: Your email (optional)
   - `EMAIL_PASS`: Your email password (optional)
   - `MANAGER_EMAIL`: Manager email (optional)

6. Click "Create Web Service"
7. Copy the URL (e.g., `https://your-app.onrender.com`)

### Step 3: Deploy Frontend
1. In Render, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `incident-reports-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add Environment Variable:
   - `VITE_API_URL`: Your backend URL from Step 2

5. Click "Create Static Site"
6. Your app is now live! 🎉

## 🔧 Alternative: Deploy to Vercel

### Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set environment variable: `VITE_API_URL`
4. Deploy!

### Backend (Railway/Render)
1. Deploy backend to Railway or Render
2. Update frontend environment variable
3. Redeploy frontend

## 📱 Portfolio Ready Features

✅ **Always Online** - No need to run MongoDB locally  
✅ **Mobile Responsive** - Works on all devices  
✅ **Professional UI** - Clean, modern design  
✅ **Real Database** - MongoDB Atlas (free tier)  
✅ **Email Notifications** - Optional but impressive  
✅ **Excel Import/Export** - Shows technical skills  

## 🔗 Your Portfolio Links

Once deployed, you'll have:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.onrender.com`
- **GitHub**: `https://github.com/yourusername/incident-reports`

## 💡 Portfolio Tips

1. **Add to your resume**: "Full-stack incident management system with React, Node.js, MongoDB"
2. **Highlight features**: Employee points tracking, Excel import/export, mobile responsive
3. **Show technical skills**: React, Node.js, Express, MongoDB, REST APIs, responsive design
4. **Demo the app**: Create a quick video showing the features

## 🛠️ Local Development

For local development, just run:
```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev
```

Your app will work locally with MongoDB Atlas! 