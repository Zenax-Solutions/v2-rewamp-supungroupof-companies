# Fixed Hardcoded localhost:3001 URLs

## Problem
All upload URLs were hardcoded to `http://localhost:3001/uploads/...` instead of using the configured API base URL. This caused:
- Images not loading on production (404 errors)
- PDFs not accessible on production
- Need to rebuild frontend for every environment change

## Solution

### 1. Created Centralized Helper Function
**File:** `src/services/api.ts`

Added `getFileUrl()` helper function that:
- Uses `VITE_API_URL` environment variable
- Automatically constructs correct base URL
- Handles both relative paths and absolute URLs
- Works across all environments (development, production)

```typescript
// Extract the base URL without /api suffix for uploads
const BASE_URL = API_BASE_URL.replace(/\/api$/, '');

/**
 * Helper function to get the full URL for uploaded files
 * Handles both relative paths (/uploads/...) and absolute URLs
 */
export const getFileUrl = (path: string | undefined): string | null => {
  if (!path) return null;
  // If it's already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Otherwise, construct full URL with backend server
  return `${BASE_URL}${path}`;
};
```

### 2. Updated All Components

Replaced hardcoded URLs in:

#### ✅ `src/pages/CompanyDetail.tsx`
- Removed local `getImageUrl()` function
- Imported and used `getFileUrl()` from api.ts
- Fixed company image URLs
- Fixed catalog PDF URLs in viewer and download links

#### ✅ `src/components/ImagePlaceholder.tsx`
- Removed local `getImageUrl()` function
- Imported and used `getFileUrl()` from api.ts
- Fixed company images across the site

#### ✅ `src/pages/admin/CompanyForm.tsx`
- Removed hardcoded localhost URLs
- Imported and used `getFileUrl()` from api.ts
- Fixed image preview URLs
- Fixed catalog PDF preview URLs

#### ✅ `src/pages/admin/BrandList.tsx`
- Removed local `getImageUrl()` function
- Imported and used `getFileUrl()` from api.ts
- Fixed brand logo URLs in admin table

#### ✅ `src/pages/admin/BrandForm.tsx`
- Already updated (was using getFileUrl)

#### ✅ `src/components/BrandShowcase.tsx`
- Already updated (was using getFileUrl)

## How It Works Now

### Development (localhost)
```bash
# No .env file or default value
API calls: http://localhost:3001/api
Uploads: http://localhost:3001/uploads/file.jpg
```

### Production (supuncompanies.com)
```bash
# With .env file: VITE_API_URL=https://supuncompanies.com/api
API calls: https://supuncompanies.com/api
Uploads: https://supuncompanies.com/uploads/file.jpg
```

## Environment Configuration

### Development
No configuration needed - uses defaults:
```typescript
const API_BASE_URL = 'http://localhost:3001/api';
const BASE_URL = 'http://localhost:3001';
```

### Production Build
Create `.env` file before building:
```env
VITE_API_URL=https://supuncompanies.com/api
```

Then build:
```bash
npm run build
```

Result:
```typescript
const API_BASE_URL = 'https://supuncompanies.com/api';
const BASE_URL = 'https://supuncompanies.com';
```

## Files Changed

1. ✅ `src/services/api.ts` - Added BASE_URL and getFileUrl() function
2. ✅ `src/pages/CompanyDetail.tsx` - Updated to use getFileUrl()
3. ✅ `src/components/ImagePlaceholder.tsx` - Updated to use getFileUrl()
4. ✅ `src/pages/admin/CompanyForm.tsx` - Updated to use getFileUrl()
5. ✅ `src/pages/admin/BrandList.tsx` - Updated to use getFileUrl()
6. ✅ `FIX_UPLOADS_404.md` - Created Nginx configuration guide

## Next Steps for Production

### 1. Rebuild Frontend with Correct Environment
```bash
# On your development machine or server
cd /path/to/project

# Create .env file
echo "VITE_API_URL=https://supuncompanies.com/api" > .env

# Rebuild
npm run build

# Upload dist/ folder to server
```

### 2. Fix Nginx Configuration
Follow the guide in `FIX_UPLOADS_404.md` to configure Nginx to serve uploaded files from `server/uploads/` directory.

Key Nginx configuration:
```nginx
# Serve uploaded files
location /uploads/ {
    alias /path/to/project/server/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### 3. Verify Everything Works
- ✅ API calls use production domain
- ✅ Images load from production domain
- ✅ PDF catalogs accessible from production domain
- ✅ No more 404 errors for uploads

## Benefits

1. **Single Source of Truth** - All file URLs generated from one function
2. **Environment Aware** - Automatically uses correct domain
3. **Easy Maintenance** - Change URL logic in one place
4. **Type Safe** - TypeScript ensures correct usage
5. **DRY Principle** - No duplicate URL construction logic

## Testing

### Local Testing
```bash
npm run dev
# Should use http://localhost:3001/uploads/...
```

### Production Testing
```bash
# Create .env
echo "VITE_API_URL=https://supuncompanies.com/api" > .env

# Build
npm run build

# Check built files contain correct URL
grep -r "supuncompanies.com" dist/assets/*.js
# Should find production URLs, not localhost
```

## Commit Message
```
fix: Replace hardcoded localhost URLs with environment-based file URLs

- Add getFileUrl() helper in api.ts for centralized URL construction
- Update all components to use getFileUrl() instead of hardcoded localhost:3001
- Remove duplicate getImageUrl() functions from components
- Support environment-specific URLs via VITE_API_URL
- Fix 404 errors for uploaded files on production

Affected components:
- CompanyDetail.tsx
- ImagePlaceholder.tsx
- CompanyForm.tsx
- BrandList.tsx

Files already updated:
- BrandForm.tsx
- BrandShowcase.tsx
```
