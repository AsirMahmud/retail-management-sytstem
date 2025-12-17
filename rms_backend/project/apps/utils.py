import os
import sys
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile, UploadedFile

def optimize_image(image_field, max_width=1920, max_height=1920):
    """
    Optimizes the uploaded image:
    1. Resizes it if it exceeds max dimensions (maintaining aspect ratio).
    2. Converts it to WebP format.
    3. Reduces file size.
    """
    # Only process if it's a new upload (UploadedFile)
    # Existing files are FieldFile and shouldn't be re-processed
    if not image_field or not hasattr(image_field, 'file') or not isinstance(image_field.file, UploadedFile):
        return

    # Open the image using Pillow
    img = Image.open(image_field)
    
    # Check if image needs resizing
    if img.height > max_height or img.width > max_width:
        output_size = (max_width, max_height)
        img.thumbnail(output_size)
    
    # Prepare for saving
    output = BytesIO()
    
    # Convert RGBA to RGB if needed (WebP supports transparency, but if we wanted JPEG we'd need this)
    # For WebP, we can keep RGBA for transparency
    
    # Save as WebP
    img.save(output, format='WEBP', quality=85, optimize=True)
    output.seek(0)
    
    # Change the file extension
    new_name = os.path.splitext(image_field.name)[0] + '.webp'
    
    # Create a new Django File object
    image_field.file = InMemoryUploadedFile(
        output,
        'ImageField',
        new_name,
        'image/webp',
        sys.getsizeof(output),
        None
    )
    image_field.name = new_name
