# Deployment Guide

## MongoDB Setup

1. Use the MongoDB Atlas connection string:
   ```
   mongodb+srv://glendatamar_db_user:SSFSbjnoGU5N233X@minutantsukool.p4udazm.mongodb.net/?retryWrites=true&w=majority&appName=minutantsukool
   ```

2. Update your `.env` file in the backend with this connection string.

## Render (Backend) Deployment

### Steps:

1. **Create a Render account** at https://render.com

2. **Create a new Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure the service**:
   - **Name**: `minu-tantsukool-api` (or any name you prefer)
   - **Root Directory**: Leave empty (Render will detect it automatically)
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or choose a paid plan)

4. **Set Environment Variables** in Render dashboard:
   - `NODE_ENV` = `production`
   - `PORT` = (Render will set this automatically, but you can set it to 10000)
   - `MONGODB_URI` = `mongodb+srv://glendatamar_db_user:SSFSbjnoGU5N233X@minutantsukool.p4udazm.mongodb.net/?retryWrites=true&w=majority&appName=minutantsukool`
   - `JWT_SECRET` = (generate a strong random string)
   - `JWT_EXPIRE` = `7d`
   - `FRONTEND_URL` = (your Vercel frontend URL, e.g., `https://your-app.vercel.app`)
   - `BACKEND_URL` = (your Render backend URL, will be like `https://minu-tantsukool-api.onrender.com`)
   - (Optional) Email and Cloudinary variables if you're using them

5. **Deploy**: Click "Create Web Service"

6. **Note**: The free tier on Render spins down after 15 minutes of inactivity. The first request after spin-down may take 30-60 seconds.

### Troubleshooting Render:

- **Error: Cannot find module '/opt/render/project/src/routes/auth.js'**
  - **Solution**: Make sure the Root Directory is set correctly or left empty, and Build/Start commands include `cd backend &&`
  - **Alternative**: Move `render.yaml` to the root of your repository and use it for automatic configuration

## Vercel (Frontend) Deployment

### Steps:

1. **Create a Vercel account** at https://vercel.com

2. **Import your GitHub repository**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure the project**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `dist` (or leave default)
   - **Install Command**: `npm install` (or leave default)

4. **Set Environment Variables**:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com` (your Render backend URL)

5. **Deploy**: Click "Deploy"

### Troubleshooting Vercel:

- **Error: Cannot resolve import "/src/main.jsx"**
  - **Solution**: Make sure Root Directory is set to `frontend` in Vercel settings
  - Verify that `index.html` is in the `frontend/` directory
  - Check that `vite.config.js` has the correct configuration

- **Error: Command "npm run build" exited with 1**
  - **Solution**: Check the build logs in Vercel for specific errors
  - Make sure all dependencies are listed in `package.json`
  - Verify that Node.js version is compatible (Vercel uses Node 18 by default)

## Alternative: Manual Deployment Instructions

### For Render (if automatic detection doesn't work):

1. In Render dashboard, set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### For Vercel (if automatic detection doesn't work):

1. Create `vercel.json` in the `frontend/` directory:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

2. In Vercel dashboard, set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`

## Post-Deployment

1. **Seed the database**:
   - You can run the seed script locally pointing to your production MongoDB:
   ```bash
   cd backend
   MONGODB_URI=your-production-mongodb-uri npm run seed
   ```
   - Or create a one-time script endpoint in your backend to seed the database (remove after use for security)

2. **Test the deployment**:
   - Visit your Vercel frontend URL
   - Try logging in with: `admin@tantsukool.ee` / `admin123`
   - Verify API calls are working

3. **Update CORS settings**:
   - Make sure `FRONTEND_URL` in backend environment variables matches your Vercel URL
   - Update CORS in `backend/server.js` if needed

## Environment Variables Summary

### Backend (Render):
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Random secret string for JWT tokens
- `JWT_EXPIRE` - Token expiration (e.g., `7d`)
- `FRONTEND_URL` - Your Vercel frontend URL
- `BACKEND_URL` - Your Render backend URL
- `PORT` - Port number (Render sets this automatically)
- `NODE_ENV` - `production`

### Frontend (Vercel):
- `VITE_API_URL` - Your Render backend URL (e.g., `https://minu-tantsukool-api.onrender.com`)

## Notes

- Render free tier has cold starts (30-60 seconds after inactivity)
- Consider upgrading to a paid plan for production use
- Always use environment variables for sensitive data
- Never commit `.env` files to GitHub
- Test thoroughly after deployment

