from django.utils.deprecation import MiddlewareMixin
from django.conf import settings

class DisableCSRFForAPIs(MiddlewareMixin):
    def process_request(self, request):
        if request.path.startswith('/api/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
