# Favicon Setup Guide for Raw Stitch

## What is a Favicon?
A favicon is the small icon that appears in:
- Browser tabs
- Bookmarks
- Browser history
- Mobile home screen shortcuts
- Search engine results

## Image Requirements

### Required Sizes and Formats:

1. **favicon.ico** (16x16, 32x32, 48x48 - multi-size ICO file)
   - Format: `.ico`
   - Sizes: 16x16, 32x32, 48x48 pixels (all in one file)
   - Location: `/public/favicon.ico`

2. **icon-16x16.png**
   - Format: PNG
   - Size: 16x16 pixels
   - Location: `/public/icon-16x16.png`

3. **icon-32x32.png**
   - Format: PNG
   - Size: 32x32 pixels
   - Location: `/public/icon-32x32.png`

4. **icon-192x192.png** (Android Chrome)
   - Format: PNG
   - Size: 192x192 pixels
   - Location: `/public/icon-192x192.png`

5. **icon-512x512.png** (Android Chrome, PWA)
   - Format: PNG
   - Size: 512x512 pixels
   - Location: `/public/icon-512x512.png`

6. **apple-icon.png** (iOS Safari)
   - Format: PNG
   - Size: 180x180 pixels
   - Location: `/public/apple-icon.png`

## Design Guidelines

### Best Practices:
- ✅ Use a simple, recognizable design (works at small sizes)
- ✅ Use high contrast colors
- ✅ Keep it square (1:1 aspect ratio)
- ✅ Avoid fine details (they won't be visible at 16x16)
- ✅ Use transparent background (PNG) or solid color (ICO)
- ✅ Test at different sizes to ensure readability

### For Raw Stitch:
- Use your logo or brand symbol
- Fashion/fabric theme works well
- Consider using initials "RS" or a stylized needle/thread icon
- Match your brand colors

## How to Create Favicons

### Option 1: Online Favicon Generators (Easiest)
1. **RealFaviconGenerator**: https://realfavicongenerator.net/
   - Upload your logo/image (at least 512x512px)
   - It generates all required sizes automatically
   - Download and extract to `/public` folder

2. **Favicon.io**: https://favicon.io/
   - Create from text, image, or emoji
   - Generates all sizes

3. **Favicon Generator**: https://www.favicon-generator.org/
   - Upload image and get all formats

### Option 2: Design Software
1. Create a 512x512px square design in:
   - Adobe Illustrator
   - Figma
   - Canva
   - Photoshop

2. Export at required sizes:
   - 16x16, 32x32, 192x192, 512x512, 180x180

3. Convert to ICO format:
   - Use online converter or ImageMagick
   - Command: `convert icon-16x16.png icon-32x32.png icon-48x48.png favicon.ico`

## Installation Steps

1. **Prepare your images** following the sizes above

2. **Place files in `/public` folder**:
   ```
   rms_ecom/
   └── public/
       ├── favicon.ico
       ├── icon-16x16.png
       ├── icon-32x32.png
       ├── icon-192x192.png
       ├── icon-512x512.png
       └── apple-icon.png
   ```

3. **The favicon is already configured** in `app/layout.tsx` - just add the files!

4. **Test locally**:
   - Restart your dev server
   - Check browser tab for the icon
   - Clear browser cache if needed (Ctrl+Shift+Delete)

## Quick Start (Using Your Existing Logo)

If you have a logo file (like `placeholder-logo.png`):

1. Go to https://realfavicongenerator.net/
2. Upload your logo file
3. Configure settings:
   - iOS: Use your logo
   - Android: Use your logo
   - Windows: Use your logo
   - Favicon: Use your logo
4. Click "Generate your Favicons and HTML code"
5. Download the package
6. Extract all files to `/public` folder
7. Done! The favicon will appear automatically

## Troubleshooting

### Icon not showing?
- Clear browser cache
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Check file names match exactly (case-sensitive)
- Verify files are in `/public` folder, not `/app` folder
- Restart Next.js dev server

### Icon looks blurry?
- Ensure source image is high resolution (512x512 minimum)
- Use PNG format for better quality
- Avoid upscaling small images

### Different icon on different devices?
- This is normal - each platform uses different sizes
- Ensure all sizes are provided for best compatibility


