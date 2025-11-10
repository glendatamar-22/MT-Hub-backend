# Render Deployment - Step by Step

## The Issue
Render was looking for files in the wrong directory because it wasn't using the `backend/` folder as the root directory.

## Solution
The `render.yaml` file now specifies `rootDir: backend` which tells Render to treat the `backend/` folder as the root of the project.

## Manual Configuration (If render.yaml doesn't work)

If Render doesn't automatically detect the `render.yaml` file, you can configure it manually:

### Step 1: Create New Web Service
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your repository

### Step 2: Configure Service Settings
- **Name**: `minu-tantsukool-api` (or any name)
- **Region**: Choose closest to you
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend` ⚠️ **IMPORTANT: Set this to `backend`**
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or choose paid)

### Step 3: Set Environment Variables
Click "Advanced" → "Add Environment Variable" and add:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://glendatamar_db_user:SSFSbjnoGU5N233X@minutantsukool.p4udazm.mongodb.net/?retryWrites=true&w=majority&appName=minutantsukool
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-url.vercel.app
BACKEND_URL=https://your-backend-url.onrender.com
PORT=10000
```

**Important Notes:**
- Replace `JWT_SECRET` with a strong random string (you can generate one online)
- Replace `FRONTEND_URL` with your Vercel frontend URL (after you deploy it)
- Replace `BACKEND_URL` with your Render backend URL (you'll get this after deployment)
- `PORT` should be set to `10000` or leave it - Render will set it automatically

### Step 4: Deploy
Click "Create Web Service" and wait for deployment.

## Verify Deployment

After deployment, you should see:
1. Build logs showing `npm install` running successfully
2. Deployment logs showing the server starting
3. A green "Live" indicator
4. Your backend URL (e.g., `https://minu-tantsukool-api.onrender.com`)

## Test the Deployment

1. Visit: `https://your-backend-url.onrender.com/api/health`
2. You should see: `{"status":"OK","message":"Server is running"}`

## Troubleshooting

### Error: Cannot find module '/opt/render/project/src/routes/auth.js'

**Cause**: Render is not using the correct root directory.

**Solutions**:
1. **Check Root Directory**: In Render dashboard, make sure "Root Directory" is set to `backend` (not empty, not `src`, not `/backend`)
2. **Verify render.yaml**: Make sure `render.yaml` is in the root of your repository (same level as `backend/` and `frontend/` folders)
3. **Manual Override**: If `render.yaml` isn't working, manually set Root Directory to `backend` in Render dashboard

### Error: MongoDB connection failed

**Solutions**:
1. Check that `MONGODB_URI` environment variable is set correctly
2. Verify MongoDB Atlas allows connections from all IPs (0.0.0.0/0) in Network Access
3. Check that the database user has proper permissions

### Error: Port already in use

**Solutions**:
1. Don't set `PORT` environment variable - Render sets it automatically
2. Or set `PORT=10000` in environment variables
3. Make sure `server.js` uses `process.env.PORT || 5000`

### Build fails

**Solutions**:
1. Check Node.js version - Render uses Node 18 by default
2. Verify all dependencies are in `package.json`
3. Check build logs for specific error messages
4. Make sure `package.json` has `"type": "module"` for ES modules

## After Successful Deployment

1. **Update Frontend Environment Variable**:
   - In Vercel, set `VITE_API_URL` to your Render backend URL
   - Example: `VITE_API_URL=https://minu-tantsukool-api.onrender.com`

2. **Seed the Database**:
   - Run the seed script locally pointing to production MongoDB:
   ```bash
   cd backend
   MONGODB_URI=mongodb+srv://glendatamar_db_user:SSFSbjnoGU5N233X@minutantsukool.p4udazm.mongodb.net/?retryWrites=true&w=majority&appName=minutantsukool npm run seed
   ```

3. **Test the API**:
   - Visit your backend health endpoint
   - Test login endpoint: `POST /api/auth/login`

## Next Steps

1. Deploy frontend to Vercel
2. Update `FRONTEND_URL` in Render environment variables
3. Update `VITE_API_URL` in Vercel environment variables
4. Test the full application

