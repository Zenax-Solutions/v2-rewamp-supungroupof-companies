# Testing the New Company Form Fields

## Quick Start

### 1. Restart the Backend Server
The database migrations will run automatically when the server starts:

```powershell
cd server
npm start
```

You should see migration messages like:
- ✅ Migration completed: phone column added
- ✅ Migration completed: hotline column added
- ✅ Migration completed: email column added
- etc.

### 2. Start the Frontend
```powershell
npm run dev
```

### 3. Test the New Features

#### Login to Admin Panel
- Navigate to `/admin/login`
- Use your admin credentials

#### Add/Edit a Company
1. Go to Companies list
2. Click "Add New Company" or edit an existing one
3. You'll see new sections:
   - **Contact Information** (after Basic Information)
     - Phone Number
     - Hotline
     - Email
     - Fax Number
   - **Display Order** field in Basic Information
   - **Social Media Links** section
     - Add platform name and URL
     - Click "Add" button
     - Remove links with X button
   - **Image Gallery** section
     - Select multiple images at once
     - Preview thumbnails
     - Remove individual images

#### Test Social Links
1. Enter platform name (e.g., "Facebook")
2. Enter URL (e.g., "https://facebook.com/company")
3. Press Enter or click "Add"
4. Repeat for more platforms
5. Remove any link by clicking the X button

#### Test Gallery Upload
1. Click "Choose Files" in Gallery section
2. Select multiple images (up to 10)
3. Preview will show thumbnails
4. Hover over images to see remove button
5. When editing, existing images are preserved unless removed

#### Test Display Order
1. Set sequence number (lower = appears first)
2. Companies will be sorted by this number in the grid view

### 4. Verify Data

#### Check Database
The data is stored in `server/database.sqlite`. You can inspect it with a SQLite viewer.

#### Check API Response
- GET `/api/companies` - returns all companies with new fields
- GET `/api/companies/:id` - returns single company with all fields

#### Check Frontend Display
The company detail pages will need to be updated separately to display:
- Contact information
- Social links
- Gallery images

## Field Details

### Optional vs Required
- All new fields are optional
- Sequence defaults to 0 if not provided
- Gallery and social links default to empty arrays

### Data Types
- **phone, hotline, email, faxNumber**: Text strings
- **sequence**: Integer (for sorting)
- **gallery**: JSON array of image URLs
- **socialLinks**: JSON array of objects with name and url

### Validation
- Email: Must be valid email format
- Social link URLs: Must be valid URLs
- Gallery images: Max 5MB each, images only
- Gallery limit: 10 images maximum

## Next Steps

To display the new fields on the frontend company detail pages, you'll need to:
1. Update `CompanyDetail.tsx` to show contact info
2. Display social media links with icons
3. Add an image gallery carousel or grid
4. Style the new sections to match your design

Would you like help implementing the display of these fields on the public-facing company detail pages?
