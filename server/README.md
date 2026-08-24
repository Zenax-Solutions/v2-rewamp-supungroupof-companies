# Backend API Documentation

## Overview
This is a Node.js/Express backend with SQLite database for managing company information.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```
   Update the values in `.env` as needed.

3. **Initialize and seed database:**
   ```bash
   npm run db:seed
   ```

4. **Start the server:**
   ```bash
   npm run server
   ```
   Or for development with auto-restart:
   ```bash
   npm run server:dev
   ```

5. **Run frontend and backend together:**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@supungroup.lk",
    "role": "admin"
  }
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer {token}
```

#### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "admin123",
  "newPassword": "newSecurePassword123"
}
```

### Companies

#### Get All Companies (Public)
```http
GET /api/companies
```

#### Get Single Company (Public)
```http
GET /api/companies/:id
```

#### Create Company (Admin Only)
```http
POST /api/companies
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "id": "company-id",
  "name": "Company Name",
  "shortName": "Short Name",
  "description": "Brief description",
  "fullDescription": "Detailed description",
  "industry": "Industry Type",
  "established": "2025",
  "website": "www.example.com",
  "features": ["Feature 1", "Feature 2"],
  "image": [file]
}
```

#### Update Company (Admin Only)
```http
PUT /api/companies/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "name": "Updated Name",
  "shortName": "Updated Short Name",
  // ... other fields
  "image": [file] (optional)
}
```

#### Delete Company (Admin Only)
```http
DELETE /api/companies/:id
Authorization: Bearer {token}
```

## Database Schema

### Companies Table
- `id` (TEXT, PRIMARY KEY) - Unique identifier
- `name` (TEXT) - Full company name
- `shortName` (TEXT) - Short/display name
- `description` (TEXT) - Brief description
- `fullDescription` (TEXT) - Detailed description
- `industry` (TEXT) - Industry category
- `established` (TEXT) - Establishment year
- `website` (TEXT) - Company website
- `features` (TEXT) - JSON array of features
- `imageUrl` (TEXT) - Path to company image
- `createdAt` (DATETIME) - Creation timestamp
- `updatedAt` (DATETIME) - Last update timestamp

### Users Table
- `id` (INTEGER, PRIMARY KEY) - Auto-increment ID
- `username` (TEXT) - Unique username
- `password` (TEXT) - Hashed password
- `email` (TEXT) - User email
- `role` (TEXT) - User role (admin)
- `createdAt` (DATETIME) - Creation timestamp

## Default Admin Credentials

⚠️ **IMPORTANT: Change these immediately after first login!**

- Username: `admin`
- Password: `admin123`
- Email: `admin@supungroup.lk`

## File Uploads

- Upload directory: `server/uploads/`
- Max file size: 5MB
- Allowed types: JPEG, PNG, WebP
- Files are accessible at: `http://localhost:3001/uploads/{filename}`

## Security Notes

1. **JWT Secret:** Change `JWT_SECRET` in `.env` to a strong random string in production
2. **Password:** Change default admin password immediately
3. **CORS:** Configure CORS settings for production
4. **HTTPS:** Use HTTPS in production
5. **Rate Limiting:** Consider adding rate limiting for production

## Development Scripts

- `npm run server` - Start server
- `npm run server:dev` - Start server with nodemon (auto-restart)
- `npm run db:seed` - Seed database with initial data
- `npm start` - Run frontend and backend concurrently

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Change `JWT_SECRET` to a secure random string
3. Configure proper CORS origins
4. Set up HTTPS
5. Use a process manager like PM2
6. Consider using a production database like PostgreSQL
