# Render Deployment Fix - Critical Steps

## The Problem
Render is looking for files in `/opt/render/project/src/routes/auth.js` instead of `/opt/render/project/src/backend/routes/auth.js`. This means Render is not using the `backend/` folder as the root directory.

## The Solution

### Option 1: Use render.yaml (Automatic - Recommended)

I've updated `render.yaml` at the root of your repository with `rootDir: backend`. This should automatically configure Render.

**Steps:**
1. Make sure `render.yaml` is committed to your repository at the root level
2. Push to GitHub
3. In Render, when creating a new service, it should automatically detect and use the `render.yaml` file
4. If it doesn't auto-detect, you can manually select it during service creation

### Option 2: Manual Configuration (If render.yaml doesn't work)

**CRITICAL**: You MUST set the Root Directory manually in Render dashboard.

#### Step-by-Step Manual Setup:

1. **Go to Render Dashboard**
   - Navigate to https://render.com
   - Click on your service (or create a new one)

2. **Settings Tab**
   - Click on "Settings" tab
   - Scroll down to "Build & Deploy" section

3. **Set Root Directory** ⚠️ **THIS IS THE KEY FIX**
   - Find "Root Directory" field
   - Set it to: `backend` (just the word "backend", no slash, no quotes)
   - **NOT** `/backend` or `./backend` or empty - just `backend`

4. **Verify Build Commands**
   - Build Command: `npm install` (should be simple, no `cd` needed since root is already `backend`)
   - Start Command: `npm start` (should be simple, no `cd` needed)

5. **Save and Redeploy**
   - Click "Save Changes"
   - Go to "Manual Deploy" → "Clear build cache & deploy"

### Option 3: Delete and Recreate Service

If the above doesn't work, delete the service and recreate it:

1. **Delete the service** in Render
2. **Create a new Web Service**
3. **Connect your GitHub repo**
4. **During setup, set**:
   - Name: `minu-tantsukool-api`
   - Root Directory: `backend` ⚠️ **Set this during creation**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

## Verification

After deploying, check the logs. You should see:
- ✅ Build logs showing `npm install` running in the backend directory
- ✅ No errors about missing modules
- ✅ Server starting successfully
- ✅ MongoDB connection successful

## Environment Variables

Make sure these are set in Render dashboard:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://glendatamar_db_user:SSFSbjnoGU5N233X@minutantsukool.p4udazm.mongodb.net/?retryWrites=true&w=majority&appName=minutantsukool
JWT_SECRET=your-strong-secret-here
JWT_EXPIRE=7d
PORT=10000
FRONTEND_URL=https://your-frontend.vercel.app
BACKEND_URL=https://your-backend.onrender.com
```

## Why This Happens

Render clones your GitHub repository to `/opt/render/project/src/`. If you don't set the Root Directory, it tries to run from the repository root, which contains both `backend/` and `frontend/` folders. Since `server.js` is in `backend/`, it can't find the route files.

By setting Root Directory to `backend`, Render changes its working directory to `backend/` before running build/start commands, so `server.js` can correctly find `./routes/auth.js`.

## Still Having Issues?

1. **Check the logs**: Look at the build and runtime logs in Render
2. **Verify file structure**: Make sure `backend/server.js` and `backend/routes/auth.js` exist
3. **Check Root Directory**: Double-check it's set to exactly `backend` (no slashes, no quotes)
4. **Clear cache**: Try "Clear build cache & deploy" in Render
5. **Check render.yaml**: Make sure it's at the repository root (same level as `backend/` and `frontend/` folders)

## Quick Test

After deployment, test the health endpoint:
```
https://your-backend-url.onrender.com/api/health
```

You should see:
```json
{"status":"OK","message":"Server is running"}
```

If you see this, the deployment is successful! 🎉

