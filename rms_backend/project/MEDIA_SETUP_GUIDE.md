# Media Directory Setup Guide

## Problem
The error `[Errno 13] Permission denied: '/home/raw'` occurs because Django cannot create the media directory structure on your production server.

## Solution

### 1. Update Your Production Server

Your production server needs to be updated with the new settings. The current production server is using old media configuration.

### 2. Create Media Directory on Production Server

Run these commands on your production server:

```bash
# Navigate to your project directory
cd /home/rawstitc/rv2

# Create the media directory
mkdir -p /home/rawstitc/public_html/media

# Set proper permissions
chmod 755 /home/rawstitc/public_html/media

# Set ownership to your user
chown -R rawstitc:rawstitc /home/rawstitc/public_html/media

# Create subdirectories for organization
mkdir -p /home/rawstitc/public_html/media/products
mkdir -p /home/rawstitc/public_html/media/categories
mkdir -p /home/rawstitc/public_html/media/users
mkdir -p /home/rawstitc/public_html/media/temp

# Set permissions for subdirectories
chmod 755 /home/rawstitc/public_html/media/*
```

### 3. Alternative: Use the Setup Script

You can also run the provided setup script:

```bash
cd /home/rawstitc/rv2
python setup_media.py
```

### 4. Update Your Django Application

Make sure your production server is using the updated settings.py file with the new media configuration.

### 5. Restart Your Application

After making these changes, restart your Django application:

```bash
# If using passenger_wsgi.py
touch passenger_wsgi.py

# Or restart your web server
```

## Verification

To verify the setup is working:

1. Check if the directory exists: `ls -la /home/rawstitc/public_html/media`
2. Check permissions: `ls -la /home/rawstitc/public_html/`
3. Test file upload through your Django admin or API

## Troubleshooting

If you still get permission errors:

1. **Check directory ownership**: `ls -la /home/rawstitc/public_html/`
2. **Check user permissions**: `whoami` and `groups`
3. **Contact your hosting provider** if you don't have sufficient permissions

## File Structure After Setup

```
/home/rawstitc/public_html/media/
├── products/          # Product images
├── categories/        # Category images  
├── users/            # User profile images
└── temp/             # Temporary uploads
```

## Security Notes

- Media files are publicly accessible via `/media/` URL
- Consider implementing file type validation
- Set up proper file size limits
- Consider using cloud storage (AWS S3, etc.) for production













