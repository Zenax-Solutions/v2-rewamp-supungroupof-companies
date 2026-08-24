# New Company Form Fields - Implementation Summary

## Overview
Added comprehensive contact information, gallery, sorting, and social media fields to the company management system.

## New Fields Added

### 1. Contact Information
- **Phone Number**: General contact phone number
- **Hotline**: Customer service hotline
- **Email**: Company email address (with validation)
- **Fax Number**: Fax contact number

### 2. Display Settings
- **Sequence**: Integer field for controlling the display order in grid views (lower numbers appear first)

### 3. Gallery
- **Multi-image upload**: Upload up to 10 images for a company gallery
- **Preview**: Shows thumbnails of uploaded and existing images
- **Remove**: Ability to remove individual images from gallery
- **Format**: Stored as JSON array of image URLs in database

### 4. Social Links
- **Dynamic form**: Add/remove social media links
- **Fields per link**:
  - Name: Platform name (e.g., Facebook, LinkedIn, Instagram)
  - URL: Full URL to the social media profile
- **Validation**: URL validation on input
- **Format**: Stored as JSON array of objects `[{name: string, url: string}]`

## Database Changes

### New Columns in `companies` table:
```sql
phone TEXT
hotline TEXT
email TEXT
faxNumber TEXT
gallery TEXT (JSON array)
sequence INTEGER DEFAULT 0
socialLinks TEXT (JSON array)
```

### Migration Support
Automatic migrations are included to add these columns to existing databases without data loss.

## Frontend Changes

### Files Modified:
1. **src/services/api.ts**
   - Updated `Company` interface with new fields
   - Added `SocialLink` interface

2. **src/pages/admin/CompanyForm.tsx**
   - Added form validation schema (Zod) for new fields
   - Added state management for gallery and social links
   - Added form sections:
     - Contact Information card
     - Social Media Links card (with dynamic add/remove)
     - Image Gallery card (with multi-upload and preview)
   - Updated sequence field in Basic Information section
   - Updated form submission to include all new fields

## Backend Changes

### Files Modified:
1. **server/database/init.js**
   - Added new columns to schema
   - Added migration logic for existing databases

2. **server/routes/companies.js**
   - Updated multer configuration to accept gallery uploads (up to 10 images)
   - Modified CREATE endpoint to handle new fields
   - Modified UPDATE endpoint to:
     - Handle new fields
     - Preserve existing gallery images
     - Merge new gallery images with preserved ones
   - Updated GET endpoints to parse JSON fields (gallery, socialLinks)
   - Updated sorting to use sequence field (ASC) then createdAt (DESC)

## Usage Instructions

### Adding a Company:
1. Fill in basic information including the new sequence field
2. Add contact information (all optional)
3. Add social media links by entering platform name and URL, then click "Add"
4. Upload gallery images (can select multiple at once)
5. Submit the form

### Editing a Company:
1. All existing data will be loaded including:
   - Contact information
   - Social links
   - Gallery images
2. Modify any fields as needed
3. Add more gallery images (existing ones are preserved)
4. Remove unwanted gallery images by hovering and clicking X
5. Submit to save changes

## Field Validation

- **Email**: Must be valid email format
- **Social Link URLs**: Must be valid URLs (http/https)
- **Sequence**: Number input (defaults to 0)
- **Gallery Images**: Max 5MB per image, only image files accepted
- **Gallery Limit**: Up to 10 images total

## Display Order
Companies are now sorted by:
1. Sequence (ascending) - lower numbers first
2. Created date (descending) - newer first for same sequence

## Data Format

### Gallery (JSON):
```json
["/uploads/image1.jpg", "/uploads/image2.jpg"]
```

### Social Links (JSON):
```json
[
  {"name": "Facebook", "url": "https://facebook.com/company"},
  {"name": "LinkedIn", "url": "https://linkedin.com/company/name"}
]
```

## Notes
- All new fields are optional except sequence (defaults to 0)
- Gallery images are preserved during updates unless explicitly removed
- Social links can be added/removed dynamically
- Contact information fields have no character limits
- The sequence field controls display order in the companies grid view
