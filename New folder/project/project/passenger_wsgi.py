import os
import sys

from django.core.wsgi import get_wsgi_application

# Add your project directory to the sys.path
sys.path.insert(0, os.path.dirname(__file__))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rms.settings')

# Get the WSGI application
application = get_wsgi_application() 