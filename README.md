# Minu Tantsukool - Dance School Management App

A full-stack web application for managing dance school groups, students, parents, schedules, and communications across Estonia.

## Quick Deployment Fixes

### Issue 1: MongoDB Connection ✅
- Updated `backend/env.example.txt` with your MongoDB Atlas connection string
- Connection string format: `mongodb+srv://glendatamar_db_user:@minutantsukool.p4udazm.mongodb.net/?retryWrites=true&w=majority&appName=minutantsukool`

### Issue 2: Render Error (Cannot find module) ✅
- Created `render.yaml` at root level with correct build/start commands
- Commands include `cd backend &&` to ensure correct directory context
- Alternative: In Render dashboard, set Root Directory to `backend` manually

### Issue 3: Vercel Build Error ✅
- Updated `vite.config.js` with proper build configuration
- Created centralized axios configuration with environment variable support
- All API calls now use `VITE_API_URL` environment variable
- Created `vercel.json` at root level for proper frontend deployment

## Features

- **Dashboard**: View all 10 dance groups with basic information
- **Group Management**: Detailed pages for each group with:
  - Student rosters with parent contact information
  - Training schedules (calendar/list view)
  - Updates feed with text, images, and videos
  - Commenting functionality
- **Admin Panel**: Manage groups, students, parents, and teachers
- **Authentication**: JWT-based authentication with role-based access (Admin/Teacher)
- **Email Notifications**: Automatic email notifications to parents when updates are posted
- **File Uploads**: Support for image and video uploads (Cloudinary or local storage)
- **Search & Filter**: Search groups and students across the application
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Nodemailer for email notifications
- Cloudinary for cloud storage (optional)

### Frontend
- React with Vite
- React Router for navigation
- Material-UI for components
- Axios for API calls
- date-fns for date formatting

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (copy from `env.example.txt`):
```bash
# Copy the example file
cp env.example.txt .env

# Then edit .env with your settings
```

The `.env` file should contain:
```env
PORT=5000
MONGODB_URI=mongodb+srv://glendatamar_db_user:SSFSbjnoGU5N233X@minutantsukool.p4udazm.mongodb.net/?retryWrites=true&w=majority&appName=minutantsukool
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email configuration (optional, for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@tantsukool.ee

# Cloudinary (optional, for cloud storage)
# If not configured, files will be stored locally
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

4. Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) and update MONGODB_URI in .env
```

5. Start the backend server:
```bash
npm run dev
```

The backend will be available at http://localhost:5000

6. Seed the database with sample data (in a new terminal):
```bash
cd backend
npm run seed
```

This will create:
- 1 admin user (admin@tantsukool.ee / admin123)
- 5 teacher users (teacher1@tantsukool.ee / teacher123, etc.)
- 10 dance groups across different Estonian cities
- Sample students and parents
- Sample schedules and updates

**Note:** The seed script will clear all existing data. Only run it once or when you want to reset the database.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, for local development):
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000

**Note:** Make sure the backend server is running before starting the frontend, as the frontend makes API calls to the backend.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Render (backend) and Vercel (frontend).

### Quick Deployment Summary:

1. **Backend (Render)**:
   - Connect GitHub repo to Render
   - Use `render.yaml` for automatic configuration
   - Set environment variables (especially `MONGODB_URI`)
   - Build command: `cd backend && npm install`
   - Start command: `cd backend && npm start`

2. **Frontend (Vercel)**:
   - Connect GitHub repo to Vercel
   - Set Root Directory to `frontend`
   - Set environment variable: `VITE_API_URL` = your Render backend URL
   - Framework: Vite
   - Build: Automatic (Vercel detects Vite)

## Usage

### Login
- Admin: `admin@tantsukool.ee` / `admin123`
- Teacher: `teacher1@tantsukool.ee` / `teacher123` (and teacher2-5)

### Admin Features
- View and manage all groups
- Create, edit, and delete groups
- Manage students and parents
- Assign teachers to groups
- View dashboard statistics

### Teacher Features
- View assigned groups
- Post updates with text, images, and videos
- Add training schedules
- View student rosters and parent contacts
- Comment on updates

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Groups
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get single group
- `POST /api/groups` - Create group (Admin only)
- `PUT /api/groups/:id` - Update group (Admin only)
- `DELETE /api/groups/:id` - Delete group (Admin only)

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get single student
- `POST /api/students` - Create student (Admin only)
- `PUT /api/students/:id` - Update student (Admin only)
- `DELETE /api/students/:id` - Delete student (Admin only)

### Updates
- `GET /api/updates` - Get all updates
- `GET /api/updates/:id` - Get single update
- `POST /api/updates` - Create update (Teacher/Admin)
- `PUT /api/updates/:id` - Update update (Author or Admin)
- `DELETE /api/updates/:id` - Delete update (Author or Admin)
- `POST /api/updates/:id/comments` - Add comment (Teacher/Admin)

### Schedules
- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/:id` - Get single schedule
- `POST /api/schedules` - Create schedule (Teacher/Admin)
- `PUT /api/schedules/:id` - Update schedule (Teacher/Admin)
- `DELETE /api/schedules/:id` - Delete schedule (Teacher/Admin)

### Admin
- `GET /api/admin/users` - Get all users (Admin only)
- `PUT /api/admin/users/:id` - Update user (Admin only)
- `GET /api/admin/parents` - Get all parents (Admin only)
- `POST /api/admin/parents` - Create parent (Admin only)
- `PUT /api/admin/parents/:id` - Update parent (Admin only)
- `DELETE /api/admin/parents/:id` - Delete parent (Admin only)
- `GET /api/admin/stats` - Get dashboard statistics (Admin only)

### Upload
- `POST /api/upload` - Upload file (image or video)

## Configuration

### Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the app password in `EMAIL_PASS` in your `.env` file

### Cloudinary Setup (Optional)

1. Create a free account at https://cloudinary.com
2. Get your cloud name, API key, and API secret
3. Add them to your `.env` file

If Cloudinary is not configured, files will be stored locally in the `uploads` directory.

## Security Considerations

- Change the JWT_SECRET in production
- Use strong passwords for database and email
- Enable HTTPS in production
- Regularly update dependencies
- Implement rate limiting for API endpoints
- Add input validation and sanitization
- Use environment variables for all secrets

## Troubleshooting

### Render Deployment Issues
- **Error: Cannot find module**: Make sure build/start commands include `cd backend &&`
- **Alternative**: Set Root Directory to `backend` in Render dashboard manually
- Check that all environment variables are set correctly

### Vercel Deployment Issues
- **Build Error**: Make sure Root Directory is set to `frontend`
- **API Connection Error**: Verify `VITE_API_URL` environment variable is set
- Check build logs for specific errors

### MongoDB Connection Issues
- Verify connection string is correct
- Check MongoDB Atlas IP whitelist (should allow all IPs for testing: 0.0.0.0/0)
- Verify database user permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please contact the development team.
