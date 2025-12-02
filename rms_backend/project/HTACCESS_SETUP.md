# .htaccess Configuration for Media Files

## Why You Need .htaccess

Yes, you **DO need** `.htaccess` configuration for your media files to work properly on your production server. Here's why:

1. **Direct File Serving**: `.htaccess` tells Apache to serve media files directly from the filesystem instead of passing them through Django
2. **Performance**: Direct serving is much faster than Django processing
3. **Security**: Prevents unauthorized access to sensitive files
4. **Caching**: Sets proper cache headers for better performance

## Files Created

### 1. Main .htaccess (in project root)
- **Location**: `/home/rawstitc/rv2/.htaccess`
- **Purpose**: Routes media requests and passes other requests to Django

### 2. Media .htaccess (in media directory)
- **Location**: `/home/rawstitc/public_html/media/.htaccess`
- **Purpose**: Handles media file serving and security

## Setup Instructions

### Step 1: Update Main .htaccess
The main `.htaccess` file has been updated with:
- Media file routing
- Security headers
- Proper Django routing

### Step 2: Create Media Directory .htaccess
Copy the `media/.htaccess` file to your production server:

```bash
# Copy the media .htaccess to the media directory
cp media/.htaccess /home/rawstitc/public_html/media/.htaccess

# Set proper permissions
chmod 644 /home/rawstitc/public_html/media/.htaccess
```

### Step 3: Verify Configuration
Test that media files are served correctly:

```bash
# Test a media file URL
curl -I https://rawstitch.info/media/products/test.jpg

# Should return 200 OK with proper headers
```

## What the .htaccess Does

### Main .htaccess Features:
- ✅ Routes `/media/` requests to filesystem
- ✅ Passes other requests to Django
- ✅ Sets security headers for media files
- ✅ Prevents access to sensitive files (.py, .log, etc.)

### Media .htaccess Features:
- ✅ Sets proper MIME types for images and documents
- ✅ Implements caching (1 year for images, 1 month for documents)
- ✅ Prevents script execution in media directory
- ✅ Sets security headers

## Troubleshooting

### If Media Files Still Don't Work:

1. **Check Apache Modules**:
   ```bash
   # Ensure these modules are enabled
   a2enmod rewrite
   a2enmod headers
   a2enmod mime
   ```

2. **Check File Permissions**:
   ```bash
   # Media directory should be 755
   chmod 755 /home/rawstitc/public_html/media
   
   # .htaccess files should be 644
   chmod 644 /home/rawstitc/public_html/media/.htaccess
   ```

3. **Test Direct Access**:
   ```bash
   # Test if you can access media files directly
   curl -I https://rawstitch.info/media/products/test.jpg
   ```

4. **Check Apache Error Logs**:
   ```bash
   tail -f /var/log/apache2/error.log
   ```

## Security Benefits

- ✅ Prevents execution of PHP/Python scripts in media directory
- ✅ Sets proper MIME types to prevent MIME sniffing attacks
- ✅ Implements caching to reduce server load
- ✅ Blocks access to sensitive file types

## Performance Benefits

- ✅ Direct file serving (no Django processing)
- ✅ Proper caching headers
- ✅ Reduced server load
- ✅ Faster page load times

Your media files should now work perfectly! 🎉















