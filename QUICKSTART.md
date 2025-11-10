# Quick Start Guide

## Prerequisites
- Node.js (v16 or higher) installed
- MongoDB running locally or MongoDB Atlas account
- npm or yarn package manager

## Setup Steps

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from env.example.txt)
cp env.example.txt .env

# Edit .env file with your settings
# At minimum, set:
# - MONGODB_URI (mongodb://localhost:27017/tantsukool for local)
# - JWT_SECRET (any random string)

# Make sure MongoDB is running
# For local MongoDB: mongod
# For MongoDB Atlas: Update MONGODB_URI in .env

# Start the backend server
npm run dev
```

The backend should now be running on http://localhost:5000

### 2. Seed Database (First Time Only)

In a new terminal:

```bash
cd backend
npm run seed
```

This creates:
- Admin user: `admin@tantsukool.ee` / `admin123`
- 5 teacher users: `teacher1@tantsukool.ee` / `teacher123` (and teacher2-5)
- 10 dance groups
- Sample students and parents
- Sample schedules and updates

### 3. Frontend Setup

In a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend should now be running on http://localhost:3000

### 4. Login

Open http://localhost:3000 in your browser and login with:
- **Admin**: `admin@tantsukool.ee` / `admin123`
- **Teacher**: `teacher1@tantsukool.ee` / `teacher123`

## Features to Test

1. **Dashboard**: View all 10 dance groups
2. **Group Detail**: Click on any group to see:
   - Student list with parent contacts (copy email button)
   - Training schedule
   - Updates feed (teachers can post updates with images/videos)
3. **Admin Panel**: Access via "Admin" button (admin users only)
   - Manage groups, students, parents, and teachers
   - View statistics

## Optional Configuration

### Email Notifications
To enable email notifications when teachers post updates:
1. Configure email settings in backend/.env:
   - EMAIL_HOST (e.g., smtp.gmail.com)
   - EMAIL_PORT (587)
   - EMAIL_USER (your email)
   - EMAIL_PASS (app password for Gmail)
   - EMAIL_FROM (sender email)

### Cloud Storage (Cloudinary)
To use cloud storage for images/videos:
1. Create a Cloudinary account (free tier available)
2. Add credentials to backend/.env:
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET

If not configured, files will be stored locally in `backend/uploads/`

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify .env file exists and has correct MONGODB_URI
- Check if port 5000 is available

### Frontend won't start
- Make sure backend is running first
- Check if port 3000 is available
- Verify all dependencies are installed

### Can't login
- Make sure you've run the seed script
- Check if backend is running
- Verify JWT_SECRET is set in .env

### File uploads not working
- If using Cloudinary: Verify credentials in .env
- If using local storage: Check that `backend/uploads/` directory exists
- Check file size (max 100MB)

## Next Steps

1. Customize the app for your needs
2. Add more groups, students, and teachers
3. Configure email notifications
4. Set up cloud storage for production
5. Deploy to production (see README.md for deployment instructions)

## Support

For issues or questions, refer to the main README.md file or contact the development team.

