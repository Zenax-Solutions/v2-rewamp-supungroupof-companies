# SEO Configuration - Supun Group of Companies

## Overview
This document outlines the SEO optimizations implemented for the Supun Group of Companies website.

## Meta Tags Implemented

### Primary SEO Tags
- **Title**: Supun Group of Companies | Leading Conglomerate in Sri Lanka
- **Description**: 200+ character description with key information
- **Keywords**: Targeted industry keywords
- **Language**: English
- **Robots**: index, follow
- **Canonical URL**: https://supuncompanies.com

### Open Graph Tags (Facebook, LinkedIn)
- og:type - website
- og:url - https://supuncompanies.com
- og:title - Full company title
- og:description - Company overview
- og:image - Company logo (1200x630px recommended)
- og:site_name - Supun Group of Companies
- og:locale - en_US

### Twitter Card Tags
- twitter:card - summary_large_image
- twitter:url - https://supuncompanies.com
- twitter:title - Full company title
- twitter:description - Company overview
- twitter:image - Company logo

### Mobile Optimization
- Viewport meta tag for responsive design
- Apple mobile web app capable
- Theme color for browser UI
- Apple touch icon for iOS home screen

## Structured Data (Schema.org)

### Organization Schema
Implemented JSON-LD structured data including:
- Organization name and description
- Logo URL
- Founding date (1999)
- Contact information (phone, email)
- Address (Sri Lanka)
- Social media profiles

## Files Created

### sitemap.xml
XML sitemap with all main pages:
- Home (priority: 1.0, weekly updates)
- About (priority: 0.8, monthly updates)
- Companies (priority: 0.9, weekly updates)
- Contact (priority: 0.7, monthly updates)

**Location**: `/public/sitemap.xml`

### robots.txt
Search engine crawler directives:
- Allow all crawlers
- Disallow /admin routes
- Sitemap reference
- Crawl delay: 1 second

**Location**: `/public/robots.txt`

## Favicon Configuration

### Files Needed
1. **favicon.ico** - 32x32px or 16x16px ICO format
2. **apple-touch-icon.png** - 180x180px PNG format
3. **Logo image** - For social sharing (1200x630px recommended)

### Current Setup
- Main favicon references `/favicon.ico`
- Apple touch icon references `/supun-group-of-companies-logo.png`
- Update these files with actual logo images

## Best Practices Implemented

✅ Semantic HTML5 structure
✅ Descriptive page titles (< 60 characters)
✅ Meta descriptions (150-160 characters)
✅ Structured data for rich snippets
✅ Mobile-friendly viewport
✅ Clean URL structure
✅ XML sitemap
✅ Robots.txt configuration
✅ Social media preview optimization
✅ Fast loading times
✅ HTTPS ready

## Next Steps

### 1. Update Favicon
Replace `/public/favicon.ico` with your company logo in ICO format.

```bash
# Convert logo to ICO format (use online converter or ImageMagick)
# Then copy to public folder
```

### 2. Optimize Social Sharing Image
Create a 1200x630px image specifically for social sharing:
- Include company logo
- Add tagline or key message
- Use brand colors
- Save as `/public/og-image.png`

### 3. Submit to Search Engines
- Google Search Console: https://search.google.com/search-console
- Bing Webmaster Tools: https://www.bing.com/webmasters
- Submit sitemap URL: https://supuncompanies.com/sitemap.xml

### 4. Verify Structured Data
Use Google's Rich Results Test:
https://search.google.com/test/rich-results

### 5. Test Social Sharing
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/

### 6. Monitor Performance
- Google Analytics
- Google Search Console
- Page Speed Insights
- Mobile-Friendly Test

## Page-Specific SEO

Each page should have unique:
- Title tag
- Meta description
- H1 heading
- Structured content with proper heading hierarchy (H1 → H2 → H3)

### Example Implementation
```typescript
// In React components
<Helmet>
  <title>About Us | Supun Group of Companies</title>
  <meta name="description" content="Learn about Supun Group's history..." />
</Helmet>
```

## Keywords Strategy

### Primary Keywords
- Supun Group of Companies
- Sri Lankan conglomerate
- Manufacturing Sri Lanka
- Cookware manufacturer
- Helmet manufacturing

### Secondary Keywords
- Chrome plating services
- Automotive design Sri Lanka
- Hospitality Sri Lanka
- Technology solutions
- Business group Sri Lanka

### Long-tail Keywords
- Leading cookware manufacturer in Sri Lanka
- Premium helmet manufacturing company
- Chrome plating and automotive design services
- Multi-industry conglomerate Sri Lanka

## Contact Information SEO

Ensure consistent NAP (Name, Address, Phone) across:
- Website footer
- Contact page
- Google Business Profile
- Social media profiles
- Business directories

## Local SEO Optimization

- Google Business Profile setup
- Local business schema markup
- Sri Lanka-specific keywords
- Location pages for each facility
- Local business citations

## Technical SEO Checklist

✅ SSL certificate (HTTPS)
✅ Mobile responsive design
✅ Fast page load times (< 3 seconds)
✅ Optimized images (WebP format, lazy loading)
✅ Minified CSS/JS
✅ Clean URL structure (no special characters)
✅ 404 error page
✅ XML sitemap
✅ Robots.txt
✅ Structured data
✅ Canonical tags

## Analytics Setup

### Google Analytics 4
Add tracking code to track:
- Page views
- User behavior
- Conversion goals
- Traffic sources

### Google Tag Manager
Centralized tag management for:
- Analytics
- Conversion tracking
- Remarketing pixels
- Third-party scripts

## Performance Optimization

- Image optimization (compress, WebP format)
- Code splitting
- Lazy loading
- CDN for static assets
- Caching strategy
- Minimize HTTP requests

## Accessibility (A11y)

Good accessibility helps SEO:
- Alt text for images
- Aria labels
- Semantic HTML
- Keyboard navigation
- Color contrast
- Screen reader compatibility

---

**Last Updated**: October 12, 2025
**Maintained By**: ZENAX (https://zenax.info/)
