# Fix Upload URLs - Use Environment Variables

## Problem
Upload file URLs (images and PDFs) were hardcoded to `http://localhost:3001/uploads/...` in multiple components. This caused issues in production where files should load from the production domain.

## Root Cause
Each component had its own `getImageUrl()` helper function that hardcoded `localhost:3001`:

```tsx
// ❌ Old hardcoded approach
const getImageUrl = (url: string) => {
  if (url.startsWith('http')) return url;
  return `http://localhost:3001${url}`;  // Hardcoded!
};
```

This meant images and PDFs would always try to load from localhost, even in production.

## Solution
Created a centralized `getFileUrl()` helper in `src/services/api.ts` that uses the same environment variable as the API:

```typescript
// ✅ New centralized approach
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const BASE_URL = API_BASE_URL.replace(/\/api$/, '');

export const getFileUrl = (path: string | undefined): string | null => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE_URL}${path}`;
};
```

## Files Changed

### 1. **src/services/api.ts**
- Added `BASE_URL` constant (API_BASE_URL without `/api` suffix)
- Created `getFileUrl()` helper function
- Exported for use in all components

### 2. **src/pages/CompanyDetail.tsx**
- Imported `getFileUrl` from api.ts
- Removed local `getImageUrl()` function
- Updated all image/PDF URLs to use `getFileUrl()`

### 3. **src/components/ImagePlaceholder.tsx**
- Imported `getFileUrl` from api.ts
- Removed local `getImageUrl()` function
- Updated to use centralized helper

### 4. **src/pages/admin/CompanyForm.tsx**
- Imported `getFileUrl` from api.ts
- Replaced hardcoded URL construction with `getFileUrl()`
- Fixed both image preview and catalog PDF preview

### 5. **src/pages/admin/BrandList.tsx**
- Imported `getFileUrl` from api.ts
- Removed local `getImageUrl()` function
- Updated brand logo display

### 6. **src/pages/admin/BrandForm.tsx**
- Imported `getFileUrl` from api.ts
- Replaced hardcoded URL construction with `getFileUrl()`

### 7. **src/components/BrandShowcase.tsx**
- Imported `getFileUrl` from api.ts
- Removed local `getImageUrl()` function
- Updated brand logo carousel

## How It Works

### Development (localhost)
When `VITE_API_URL` is not set:
- API calls: `http://localhost:3001/api`
- Uploads: `http://localhost:3001/uploads/filename.jpg`

### Production (with .env file)
When `.env` contains `VITE_API_URL=https://supuncompanies.com/api`:
- API calls: `https://supuncompanies.com/api`
- Uploads: `https://supuncompanies.com/uploads/filename.jpg`

## Benefits

1. **Single Configuration Point**: All URLs (API + uploads) use the same environment variable
2. **No Hardcoding**: No more localhost hardcoded in source code
3. **Environment Aware**: Automatically works in dev, staging, and production
4. **Type Safe**: Centralized function with proper TypeScript types
5. **DRY Principle**: One helper instead of multiple duplicated functions

## Production Deployment Steps

1. **Create .env file on server:**
   ```bash
   cd /home/supuncompanies.com/htdocs/web-folio-prime
   nano .env
   ```

2. **Add environment variable:**
   ```env
   VITE_API_URL=https://supuncompanies.com/api
   ```

3. **Rebuild frontend:**
   ```bash
   npm run build
   ```

4. **Verify build output:**
   ```bash
   grep -r "localhost:3001" dist/
   # Should return NO results
   
   grep -r "supuncompanies.com" dist/
   # Should show your production domain
   ```

5. **Clear browser cache and test**

## Testing

Test these URLs in production:
- ✅ API: `https://supuncompanies.com/api/companies`
- ✅ Images: `https://supuncompanies.com/uploads/image.jpg`
- ✅ PDFs: `https://supuncompanies.com/uploads/catalog.pdf`
- ✅ Frontend: `https://supuncompanies.com`

## Verification Commands

```bash
# Check no localhost references in built files
grep -r "localhost" dist/ | grep -v ".map"

# Check for production domain
grep -r "supuncompanies.com" dist/assets/*.js | head -5

# Test API endpoint
curl https://supuncompanies.com/api/companies

# Test upload endpoint
curl -I https://supuncompanies.com/uploads/test.jpg
```

## Related Files
- `.env.example` - Example environment configuration
- `DEPLOYMENT_GUIDE.md` - Full deployment instructions
- `FIX_PRODUCTION_API.md` - API configuration guide
