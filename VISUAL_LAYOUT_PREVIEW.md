# Visual Layout Preview - Company Detail Page

## Page Structure (Top to Bottom)

```
┌─────────────────────────────────────────────────────────────┐
│                        HERO SECTION                         │
│  [Background Image with Overlay]                            │
│  ← Back to Companies                                        │
│  [Company Icon]  Company Name                               │
│                  [Industry Badge]                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     QUICK INFO CARDS                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ Industry │  │Established│  │ Website  │                 │
│  │   [📦]   │  │   [📅]   │  │   [🌐]   │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│            📞 CONTACT INFORMATION (NEW!)                     │
│  ┌────────────────────┐  ┌────────────────────┐            │
│  │ [📱] Phone         │  │ [🎧] Hotline       │            │
│  │  +94 11 123 4567  │  │  +94 77 123 4567  │            │
│  └────────────────────┘  └────────────────────┘            │
│  ┌────────────────────┐  ┌────────────────────┐            │
│  │ [✉️] Email         │  │ [🖨️] Fax          │            │
│  │  info@company.com │  │  +94 11 123 4568  │            │
│  └────────────────────┘  └────────────────────┘            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    ABOUT [COMPANY NAME]                      │
│  Full description text goes here...                         │
│  Multiple paragraphs with company history, mission, and     │
│  vision. Detailed information about what they do.           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              🖼️ GALLERY (NEW!)                               │
│  ┌────────┐  ┌────────┐  ┌────────┐                        │
│  │ Image1 │  │ Image2 │  │ Image3 │                        │
│  │ [Hover]│  │ [Hover]│  │ [Hover]│                        │
│  └────────┘  └────────┘  └────────┘                        │
│  ┌────────┐  ┌────────┐  ┌────────┐                        │
│  │ Image4 │  │ Image5 │  │ Image6 │                        │
│  └────────┘  └────────┘  └────────┘                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│             ✓ KEY FEATURES & CAPABILITIES                   │
│  ✓ Feature 1                  ✓ Feature 4                  │
│  ✓ Feature 2                  ✓ Feature 5                  │
│  ✓ Feature 3                  ✓ Feature 6                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              🔗 CONNECT WITH US (NEW!)                       │
│  [f Facebook] [in LinkedIn] [📸 Instagram] [▶️ YouTube]    │
│  [🐦 Twitter] [🌐 Custom Link] ...                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              📄 PRODUCT CATALOG (if exists)                  │
│  [View Catalog] [Download]                                  │
│  [PDF Viewer appears when clicked]                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              INTERESTED IN [COMPANY NAME]?                   │
│  Get in touch with us to learn more...                      │
│                                                              │
│  [📱 Call Us] [🎧 Hotline] [✉️ Email Us] (NEW!)            │
│                                                              │
│  [Contact Us] [← View All Companies]                        │
└─────────────────────────────────────────────────────────────┘
```

## Mobile View (< 640px)

```
┌──────────────────────────┐
│    HERO (Full Width)     │
│  ← Back                  │
│  [Icon]                  │
│  Company Name            │
│  [Badge]                 │
└──────────────────────────┘

┌──────────────────────────┐
│  QUICK INFO (Stacked)    │
│  ┌──────────────────┐    │
│  │    Industry      │    │
│  └──────────────────┘    │
│  ┌──────────────────┐    │
│  │   Established    │    │
│  └──────────────────┘    │
│  ┌──────────────────┐    │
│  │     Website      │    │
│  └──────────────────┘    │
└──────────────────────────┘

┌──────────────────────────┐
│ CONTACT (Single Column)  │
│  ┌──────────────────┐    │
│  │ [📱] Phone       │    │
│  └──────────────────┘    │
│  ┌──────────────────┐    │
│  │ [🎧] Hotline     │    │
│  └──────────────────┘    │
│  ┌──────────────────┐    │
│  │ [✉️] Email       │    │
│  └──────────────────┘    │
└──────────────────────────┘

┌──────────────────────────┐
│      ABOUT SECTION       │
└──────────────────────────┘

┌──────────────────────────┐
│  GALLERY (Single Col)    │
│  ┌──────────────────┐    │
│  │     Image 1      │    │
│  └──────────────────┘    │
│  ┌──────────────────┐    │
│  │     Image 2      │    │
│  └──────────────────┘    │
└──────────────────────────┘

┌──────────────────────────┐
│  SOCIAL (Stacked/Wrap)   │
│  ┌──────────────────┐    │
│  │   Facebook       │    │
│  └──────────────────┘    │
│  ┌──────────────────┐    │
│  │   LinkedIn       │    │
│  └──────────────────┘    │
└──────────────────────────┘

┌──────────────────────────┐
│  CTA (Stacked Buttons)   │
│  ┌──────────────────┐    │
│  │   📱 Call Us     │    │
│  └──────────────────┘    │
│  ┌──────────────────┐    │
│  │   Contact Us     │    │
│  └──────────────────┘    │
└──────────────────────────┘
```

## Interactive Elements

### Contact Information
```
┌─────────────────────────┐
│ [📱] Phone              │ ← Click to call on mobile
│  +94 11 123 4567       │    Hover: text color changes
└─────────────────────────┘

┌─────────────────────────┐
│ [✉️] Email              │ ← Click to open email client
│  info@company.com      │    Hover: text color changes
└─────────────────────────┘
```

### Gallery Images
```
┌─────────────────────────┐
│                         │
│      Image Preview      │ ← Hover: scales up 105%
│      (Aspect 16:9)      │    Shows gradient overlay
│                         │    "View Image" text appears
└─────────────────────────┘
```

### Social Links
```
┌─────────────────────────┐
│ [f] Facebook        ↗   │ ← Hover: fills with primary color
└─────────────────────────┘    Icon scales up
                                Opens in new tab
```

## Color Scheme

- **Primary**: Phone, Email icons background (10% opacity)
- **Accent**: Hotline icon background (10% opacity)
- **Muted**: Fax icon background
- **Hover**: Full primary color for social links
- **Gradients**: Used in gallery overlays

## Spacing

- Section padding: 8 (32px)
- Grid gaps: 4-6 (16-24px)
- Card margins: 12 (48px between sections)
- Button gaps: 2-4 (8-16px)

## Typography

- Section titles: text-3xl font-bold (30px)
- Contact labels: text-sm text-muted-foreground
- Contact values: text-lg font-semibold
- Descriptions: text-lg leading-relaxed

## Animations

1. **Image Hover**: scale(1.05) over 300ms
2. **Social Link Hover**: Icon scale(1.1)
3. **Gallery Overlay**: Opacity 0 → 1 on hover
4. **Shadow Growth**: From md to xl on hover

## Conditional Display Logic

Each new section checks for data before rendering:

1. **Contact Section**: Shows if ANY contact field exists
2. **Gallery Section**: Shows if gallery array has length > 0
3. **Social Links**: Shows if socialLinks array has length > 0
4. **Quick Contact Buttons**: Shows if phone, hotline, or email exists

This ensures a clean page without empty sections!
