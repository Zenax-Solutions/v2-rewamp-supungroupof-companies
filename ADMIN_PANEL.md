# Admin Panel Documentation

## Overview

The admin panel provides a secure interface for managing company information through a modern, user-friendly dashboard.

## Access

- **URL**: http://localhost:8080/admin/login
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin123`

## Features

### 🔐 Authentication
- Secure JWT-based authentication
- Protected routes requiring login
- Automatic session management
- Logout functionality

### 🏢 Company Management

#### Company List (`/admin/companies`)
- View all companies in a searchable table
- Real-time search by name, industry, or description
- Statistics dashboard showing:
  - Total number of companies
  - Number of industries
  - Currently displayed companies
- Edit and delete actions for each company

#### Add Company (`/admin/companies/new`)
- Comprehensive form with validation
- Fields:
  - **Basic Information**:
    - Company ID (unique identifier, lowercase with hyphens)
    - Full Name
    - Short Name
    - Industry
    - Established Year
    - Website (optional)
  - **Description**:
    - Short Description
    - Full Description
  - **Features**: Add multiple features as a list
  - **Image Upload**: Featured image (max 5MB, JPEG/PNG/WebP)
- Image preview before upload
- Form validation with helpful error messages

#### Edit Company (`/admin/companies/:id/edit`)
- Pre-populated form with existing company data
- Same fields as Add Company
- Update image or keep existing one
- Cannot change Company ID (unique identifier)

#### Delete Company
- Confirmation dialog before deletion
- Prevents accidental deletions
- Permanent removal of company data

## API Endpoints

The admin panel communicates with the backend API:

### Authentication
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/change-password` - Change password

### Companies
- `GET /api/companies` - Get all companies (public)
- `GET /api/companies/:id` - Get single company (public)
- `POST /api/companies` - Create company (admin only)
- `PUT /api/companies/:id` - Update company (admin only)
- `DELETE /api/companies/:id` - Delete company (admin only)

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router v6** for routing
- **React Hook Form** for form management
- **Zod** for validation
- **Axios** for API calls
- **shadcn/ui** for UI components
- **Tailwind CSS** for styling

### Backend
- **Node.js** with Express
- **SQLite** with better-sqlite3
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads

## Development

### Running the Application

1. **Start both servers** (frontend + backend):
   ```bash
   npm start
   ```

2. **Start frontend only**:
   ```bash
   npm run dev
   ```

3. **Start backend only**:
   ```bash
   npm run server:dev
   ```

### Database Management

1. **Initialize database**:
   ```bash
   npm run db:init
   ```

2. **Seed database** with initial data:
   ```bash
   npm run db:seed
   ```

### File Structure

```
src/
├── services/
│   └── api.ts              # API service layer with axios
├── components/
│   ├── ProtectedRoute.tsx  # Route protection wrapper
│   └── AdminLayout.tsx     # Admin dashboard layout
├── pages/
│   └── admin/
│       ├── Login.tsx       # Admin login page
│       ├── CompanyList.tsx # Company management table
│       └── CompanyForm.tsx # Add/Edit company form
└── App.tsx                 # Route configuration

server/
├── index.js                # Express server
├── database/
│   ├── init.js            # Database schema
│   └── seed.js            # Seed data
├── middleware/
│   └── auth.js            # JWT authentication
└── routes/
    ├── auth.js            # Auth endpoints
    └── companies.js       # Company CRUD endpoints
```

## Security Features

1. **JWT Authentication**
   - Tokens expire after 24 hours
   - Automatic token validation on protected routes
   - Secure password hashing with bcrypt

2. **Protected Routes**
   - All admin routes require authentication
   - Automatic redirect to login if not authenticated
   - Token stored securely in localStorage

3. **File Upload Security**
   - File type validation (images only)
   - File size limit (5MB)
   - Unique filename generation to prevent conflicts

## Best Practices

1. **Change Default Password**
   - Navigate to admin panel
   - Use the change password endpoint
   - Store credentials securely

2. **Image Optimization**
   - Compress images before upload
   - Use web-friendly formats (WebP, JPEG, PNG)
   - Keep file sizes under 2MB for better performance

3. **Regular Backups**
   - Backup the SQLite database file (`server/database.sqlite`)
   - Backup uploaded images (`server/uploads/`)

## Troubleshooting

### Cannot Login
- Verify backend server is running (`http://localhost:3001`)
- Check credentials (default: admin/admin123)
- Clear localStorage and try again
- Check browser console for errors

### Images Not Displaying
- Ensure images are uploaded successfully
- Check file format (JPEG, PNG, WebP only)
- Verify file size is under 5MB
- Check `server/uploads/` directory exists

### API Errors
- Verify both servers are running
- Check `.env` file configuration
- Ensure database is initialized (`npm run db:init`)
- Check backend logs in terminal

## Future Enhancements

- [ ] Multi-user support with different roles
- [ ] Activity logs and audit trail
- [ ] Bulk operations (import/export)
- [ ] Image cropping and editing
- [ ] Advanced search and filtering
- [ ] Company categories and tags
- [ ] Analytics and reporting

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend logs in the terminal
3. Check browser console for frontend errors
4. Verify all dependencies are installed (`npm install`)
