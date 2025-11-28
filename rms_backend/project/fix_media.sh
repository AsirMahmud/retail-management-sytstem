#!/bin/bash

# URGENT FIX for Production Media Directory Issue
# Run this script on your production server

echo "🔧 Fixing Production Media Directory Issue..."
echo "=================================================="

# Set variables
MEDIA_DIR="/home/rawstitc/public_html/media"
USER="rawstitc"

# Create media directory
echo "📁 Creating media directory: $MEDIA_DIR"
mkdir -p "$MEDIA_DIR"

# Set permissions
echo "🔐 Setting permissions to 755"
chmod 755 "$MEDIA_DIR"

# Create subdirectories
echo "📁 Creating subdirectories..."
mkdir -p "$MEDIA_DIR/products"
mkdir -p "$MEDIA_DIR/categories"
mkdir -p "$MEDIA_DIR/users"
mkdir -p "$MEDIA_DIR/temp"
mkdir -p "$MEDIA_DIR/uploads"

# Set permissions for subdirectories
echo "🔐 Setting permissions for subdirectories..."
chmod 755 "$MEDIA_DIR"/*

# Set ownership
echo "👤 Setting ownership to $USER:$USER"
chown -R "$USER:$USER" "$MEDIA_DIR"

# Verify the setup
echo ""
echo "✅ Verification:"
if [ -d "$MEDIA_DIR" ]; then
    echo "✅ Media directory exists: $MEDIA_DIR"
    echo "✅ Permissions: $(stat -c %a "$MEDIA_DIR")"
    echo "✅ Owner: $(stat -c %U:%G "$MEDIA_DIR")"
    echo "✅ Subdirectories:"
    ls -la "$MEDIA_DIR" | grep "^d"
fi

echo ""
echo "🎉 PRODUCTION MEDIA FIX COMPLETED!"
echo "Your Django application should now be able to upload files."
echo ""
echo "Next steps:"
echo "1. Restart your Django application"
echo "2. Test file upload through your API"














