from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.db.models import Q
from django.db import IntegrityError
from datetime import datetime
from .models import Discount, Brand, HomePageSettings, DeliverySettings
from .serializers import DiscountSerializer, DiscountListSerializer, BrandSerializer, HomePageSettingsSerializer, DeliverySettingsSerializer
from django.utils.text import slugify
from apps.inventory.models import Product, ProductVariation, Gallery, Image
from apps.customer.models import Customer
from apps.preorder.models import Preorder
from apps.preorder.serializers import PreorderSerializer
from django.db.models import Sum
from decimal import Decimal


class DiscountViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing discounts
    - List all discounts
    - Create new discount
    - Update existing discount
    - Delete discount
    - Get active discounts
    - Get expired discounts
    """
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return DiscountListSerializer
        return DiscountSerializer
    
    def get_queryset(self):
        queryset = Discount.objects.all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by discount type
        discount_type = self.request.query_params.get('discount_type', None)
        if discount_type:
            queryset = queryset.filter(discount_type=discount_type)
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            is_active_bool = is_active.lower() == 'true'
            queryset = queryset.filter(is_active=is_active_bool)
        
        # Search by name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def active(self, request):
        """Get all currently active discounts"""
        now = timezone.now()
        active_discounts = self.queryset.filter(
            is_active=True,
            status='ACTIVE',
            start_date__lte=now,
            end_date__gte=now
        )
        serializer = self.get_serializer(active_discounts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def expired(self, request):
        """Get all expired discounts"""
        now = timezone.now()
        expired_discounts = self.queryset.filter(
            end_date__lt=now
        )
        serializer = self.get_serializer(expired_discounts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def scheduled(self, request):
        """Get all scheduled discounts"""
        now = timezone.now()
        scheduled_discounts = self.queryset.filter(
            start_date__gt=now
        )
        serializer = self.get_serializer(scheduled_discounts, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a discount"""
        discount = self.get_object()
        discount.is_active = True
        discount.save()
        serializer = self.get_serializer(discount)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a discount"""
        discount = self.get_object()
        discount.is_active = False
        discount.save()
        serializer = self.get_serializer(discount)
        return Response(serializer.data)


class BrandViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing brands
    """
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Brand.objects.all()
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            is_active_bool = is_active.lower() == 'true'
            queryset = queryset.filter(is_active=is_active_bool)
        
        # Search by name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        return queryset.order_by('display_order', 'name')


class HomePageSettingsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing home page settings (singleton)
    """
    queryset = HomePageSettings.objects.all()
    serializer_class = HomePageSettingsSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    parser_classes = [MultiPartParser, FormParser]
    
    def get_object(self):
        """Always return the singleton instance"""
        return HomePageSettings.load()
    
    def list(self, request):
        """Return the singleton instance"""
        instance = HomePageSettings.load()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def create(self, request):
        """Update or create the singleton instance"""
        instance = HomePageSettings.load()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def update(self, request, id=None):
        """Update the singleton instance"""
        instance = HomePageSettings.load()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def partial_update(self, request, id=None):
        """Partially update the singleton instance"""
        instance = HomePageSettings.load()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class PublicHomePageSettingsView(APIView):
    """Public API endpoint for home page settings"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get home page settings for public access"""
        try:
            settings = HomePageSettings.load()
            serializer = HomePageSettingsSerializer(settings, context={'request': request})
            return Response(serializer.data)
        except HomePageSettings.DoesNotExist:
            # Return default values if settings don't exist
            return Response({
                'logo_image_url': None,
                'logo_text': None,
                'hero_badge_text': 'New Collection 2024',
                'hero_heading_line1': 'FIND',
                'hero_heading_line2': 'CLOTHES',
                'hero_heading_line3': 'THAT',
                'hero_heading_line4': 'Matches',
                'hero_heading_line5': 'YOUR STYLE',
                'hero_description': 'Browse through our diverse range of meticulously crafted garments...',
                'hero_primary_image_url': None,
                'hero_secondary_image_url': None,
                'stat_brands': '200+',
                'stat_products': '2,000+',
                'stat_customers': '30,000+',
            })


class PublicBrandsView(APIView):
    """Public API endpoint for active brands"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get active brands for public access"""
        brands = Brand.objects.filter(is_active=True).order_by('display_order', 'name')
        serializer = BrandSerializer(brands, many=True, context={'request': request})
        return Response(serializer.data)


class PublicProductsByColorView(APIView):
    """Public API: list products grouped by color as separate entries."""
    permission_classes = [AllowAny]

    def get_cover_image_url(self, request, product: Product, color: str):
        try:
            gallery = Gallery.objects.get(product=product, color__iexact=color)
            primary = gallery.images.filter(imageType='PRIMARY').first()
            image_obj = primary or gallery.images.first()
            if image_obj and image_obj.image:
                return request.build_absolute_uri(image_obj.image.url)
        except Gallery.DoesNotExist:
            pass
        # Fallback to product.image
        if product.image:
            return request.build_absolute_uri(product.image.url)
        return None

    def get(self, request):
        """
        Returns a flat list where each color of a product is its own card.
        Optional query params:
        - search: filter by product name contains
        - category: filter by category slug
        - online_category: filter by online category slug
        - only_in_stock: true|false
        """
        search = request.query_params.get('search')
        category_slug = request.query_params.get('category')
        online_category_slug = request.query_params.get('online_category')
        only_in_stock = str(request.query_params.get('only_in_stock', 'false')).lower() == 'true'
        product_id = request.query_params.get('product_id')
        product_ids_csv = request.query_params.get('product_ids')

        # Only return products explicitly assigned to online and active
        products = Product.objects.filter(is_active=True, assign_to_online=True)
        if search:
            products = products.filter(name__icontains=search)
        if category_slug:
            products = products.filter(category__slug=category_slug)
        if online_category_slug:
            products = products.filter(online_category__slug=online_category_slug)
        if product_id:
            products = products.filter(id=product_id)
        elif product_ids_csv:
            try:
                ids = [int(x) for x in product_ids_csv.split(',') if x.strip().isdigit()]
                if ids:
                    products = products.filter(id__in=ids)
            except Exception:
                pass

        result = []
        # Prefetch variations to reduce queries
        for product in products:
            # Consider all active variations, regardless of assign_to_online
            variations = ProductVariation.objects.filter(
                product=product,
                is_active=True,
            )
            # group by color
            color_to_stock = {}
            for v in variations:
                key = v.color.strip()
                color_to_stock.setdefault(key, 0)
                color_to_stock[key] += max(0, v.stock)
            # If no variations captured any color, fall back to galleries as color sources
            if not color_to_stock:
                for g in Gallery.objects.filter(product=product):
                    color_name = g.color.strip()
                    # Sum stock for this color if any variations exist; else 0
                    total_stock = variations.filter(color__iexact=color_name).aggregate(total=Sum('stock'))['total'] or 0
                    color_to_stock[color_name] = max(0, total_stock)
            for color_name, total_stock in color_to_stock.items():
                if only_in_stock and total_stock <= 0:
                    continue
                item = {
                    'product_id': product.id,
                    'product_name': product.name,
                    'product_price': str(product.selling_price),
                    'color_name': color_name,
                    'color_slug': slugify(color_name),
                    'total_stock': total_stock,
                    'cover_image_url': self.get_cover_image_url(request, product, color_name),
                }
                result.append(item)

        return Response(result)


class PublicProductDetailByColorView(APIView):
    """Public API: product detail for a given product and color, with sizes/stock/images."""
    permission_classes = [AllowAny]

    def get(self, request, product_id: int, color_slug: str):
        try:
            # Only return products explicitly assigned to online and active
            product = Product.objects.get(id=product_id, is_active=True, assign_to_online=True)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        # Resolve actual color name by matching slug against variations
        variations_qs = ProductVariation.objects.filter(
            product=product,
            is_active=True,
        )
        # Build available colors with stock + hex
        color_meta = {}
        for v in variations_qs:
            color_name = v.color.strip()
            color_key = slugify(color_name)
            meta = color_meta.setdefault(color_key, {
                'color_name': color_name,
                'color_slug': color_key,
                'total_stock': 0,
                'color_hex': v.color_hax or None,
            })
            meta['total_stock'] += max(0, v.stock)

        # Find requested color
        if color_slug not in color_meta:
            return Response({'detail': 'Color not found for this product'}, status=status.HTTP_404_NOT_FOUND)
        current_color_name = color_meta[color_slug]['color_name']
        current_color_hex = color_meta[color_slug].get('color_hex')

        # Images for current color
        images = []
        try:
            gallery = Gallery.objects.get(product=product, color__iexact=current_color_name)
            images_qs = gallery.images.order_by('imageType')
            for img in images_qs:
                if img.image:
                    images.append({
                        'type': img.imageType,
                        'url': request.build_absolute_uri(img.image.url)
                    })
        except Gallery.DoesNotExist:
            # Fallback to product default image
            if product.image:
                images.append({'type': 'PRIMARY', 'url': request.build_absolute_uri(product.image.url)})

        # Sizes and stock for current color
        size_entries = []
        current_variations = variations_qs.filter(color__iexact=current_color_name)
        for v in current_variations.order_by('size'):
            size_entries.append({
                'size': v.size,
                'stock_qty': max(0, v.stock),
                'in_stock': v.stock > 0,
            })

        data = {
            'product': {
                'id': product.id,
                'name': product.name,
                'price': str(product.selling_price),
                'category': product.category.name if product.category else None,
            },
            'color': {
                'name': current_color_name,
                'slug': color_slug,
                'hex': current_color_hex,
            },
            'images': images,
            'sizes': size_entries,
            'available_colors': list(color_meta.values()),
            'total_stock_for_color': sum(e['stock_qty'] for e in size_entries),
        }
        return Response(data)


class PublicDeliverySettingsView(APIView):
    """Public API: get delivery charges (inside/outside Dhaka)."""
    permission_classes = [AllowAny]

    def get(self, request):
        settings = DeliverySettings.load()
        serializer = DeliverySettingsSerializer(settings)
        return Response(serializer.data)


class DeliverySettingsView(APIView):
    """Authenticated API: update delivery charges."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        settings = DeliverySettings.load()
        serializer = DeliverySettingsSerializer(settings)
        return Response(serializer.data)

    def patch(self, request):
        settings = DeliverySettings.load()
        serializer = DeliverySettingsSerializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class PublicCartPriceView(APIView):
    """
    Public API: Accepts cart items and returns authoritative pricing.
    Body: { items: [{ productId: string|number, quantity: number }] }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        items = request.data.get('items') or []
        if not isinstance(items, list):
            return Response({'detail': 'Invalid items'}, status=status.HTTP_400_BAD_REQUEST)

        product_ids = []
        normalized = []
        for line in items:
            try:
                pid = int(line.get('productId'))
                qty = int(line.get('quantity'))
                if qty <= 0:
                    continue
                variations = line.get('variations') or {}
                color = (variations.get('color') or '').strip() if isinstance(variations, dict) else ''
                size = (variations.get('size') or '').strip() if isinstance(variations, dict) else ''
                product_ids.append(pid)
                normalized.append({'product_id': pid, 'quantity': qty, 'color': color, 'size': size})
            except Exception:
                continue

        products = Product.objects.filter(id__in=product_ids, is_active=True, assign_to_online=True)
        prod_map = {p.id: p for p in products}

        result_items = []
        subtotal = 0
        for line in normalized:
            p = prod_map.get(line['product_id'])
            if not p:
                continue
            unit_price = float(p.selling_price)

            # Determine available stock based on requested variant
            max_stock = 0
            variant_color = line.get('color') or None
            variant_size = line.get('size') or None
            try:
                q = ProductVariation.objects.filter(product=p, is_active=True)
                if variant_color:
                    q = q.filter(color__iexact=variant_color)
                if variant_size:
                    q = q.filter(size__iexact=variant_size)
                max_stock = max(0, q.aggregate(total=Sum('stock'))['total'] or 0)
            except Exception:
                max_stock = max(0, getattr(p, 'stock_quantity', 0))

            # Cap effective quantity by stock for pricing summary
            effective_qty = min(line['quantity'], max_stock) if max_stock > 0 else line['quantity']
            line_total = unit_price * effective_qty
            subtotal += line_total
            image_url = None
            if p.image:
                image_url = request.build_absolute_uri(p.image.url)
            result_items.append({
                'productId': p.id,
                'name': p.name,
                'image_url': image_url,
                'unit_price': unit_price,
                'quantity': line['quantity'],
                'max_stock': max_stock,
                'variant': {
                    'color': variant_color,
                    'size': variant_size,
                },
                'line_total': line_total,
            })

        delivery = DeliverySettings.load()
        return Response({
            'items': result_items,
            'subtotal': subtotal,
            'delivery': DeliverySettingsSerializer(delivery).data,
        })


class CreateOnlinePreorderView(APIView):
    """
    Public API endpoint to create a customer and online preorder in one request.
    Accepts the full checkout payload and creates customer if needed, then creates preorder.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Create customer (if needed) and online preorder.
        Expected payload:
        {
            "customer_name": "John Doe",
            "customer_phone": "01712345678",
            "customer_email": "john@example.com",
            "shipping_address": {
                "city_corporation": "Dhaka North City Corporation",
                "thana": "Mohammadpur",
                "place": "Shahbagh",
                "address": "Full address"
            },
            "notes": "Optional notes",
            "items": [
                {
                    "product_id": 96,
                    "size": "28",
                    "color": "Purple",
                    "quantity": 1,
                    "unit_price": 12000,
                    "discount": 0
                }
            ],
            "delivery_charge": 0,
            "delivery_method": "Inside Dhaka",
            "expected_delivery_date": "2025-12-31"  # Optional
        }
        """
        # Extract and normalize customer data
        customer_name = str(request.data.get('customer_name') or '').strip()
        customer_phone = str(request.data.get('customer_phone') or '').strip()
        customer_email = str(request.data.get('customer_email') or '').strip()

        # Validate required fields
        if not customer_phone:
            return Response(
                {'error': 'customer_phone is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not customer_name:
            return Response(
                {'error': 'customer_name is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate and normalize items
        raw_items = request.data.get('items', [])
        if not raw_items or not isinstance(raw_items, list):
            return Response(
                {'error': 'items is required and must be a non-empty list'},
                status=status.HTTP_400_BAD_REQUEST
            )
        items = []
        for idx, item in enumerate(raw_items):
            try:
                product_id = int(item.get('product_id'))
                size = str(item.get('size') or '').strip()
                color = str(item.get('color') or '').strip()
                quantity = int(item.get('quantity') or 0)
                unit_price = float(item.get('unit_price') or 0)
                discount = float(item.get('discount') or 0)
                if quantity <= 0:
                    return Response({'error': f'items[{idx}].quantity must be > 0'}, status=status.HTTP_400_BAD_REQUEST)
                if not size or not color:
                    return Response({'error': f'items[{idx}] must include non-empty size and color'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception:
                return Response({'error': f'items[{idx}] has invalid types'}, status=status.HTTP_400_BAD_REQUEST)
            items.append({
                'product_id': product_id,
                'size': size,
                'color': color,
                'quantity': quantity,
                'unit_price': unit_price,
                'discount': discount,
            })

        # Create or get customer
        try:
            customer = Customer.objects.get(phone=customer_phone)
            # Update customer info if provided
            if customer_name:
                name_parts = customer_name.split(maxsplit=1)
                customer.first_name = name_parts[0] if len(name_parts) > 0 else ''
                customer.last_name = name_parts[1] if len(name_parts) > 1 else ''
            if customer_email:
                # Only update email if it's not already set or if it's different
                # Handle email uniqueness - if email exists for another customer, skip updating
                try:
                    existing_customer_with_email = Customer.objects.exclude(id=customer.id).get(email=customer_email)
                    # Email already belongs to another customer, skip updating
                    pass
                except Customer.DoesNotExist:
                    # Email is available, update it
                    customer.email = customer_email
            customer.save()
        except Customer.DoesNotExist:
            # Create new customer
            name_parts = customer_name.split(maxsplit=1)
            first_name = name_parts[0] if len(name_parts) > 0 else ''
            last_name = name_parts[1] if len(name_parts) > 1 else ''
            
            # Build address from shipping_address if provided
            shipping_address = request.data.get('shipping_address', {})
            address_parts = []
            if shipping_address.get('address'):
                address_parts.append(shipping_address['address'])
            if shipping_address.get('place'):
                address_parts.append(shipping_address['place'])
            if shipping_address.get('thana'):
                address_parts.append(shipping_address['thana'])
            if shipping_address.get('city_corporation'):
                address_parts.append(shipping_address['city_corporation'])
            address_text = ', '.join(address_parts) if address_parts else ''

            # Handle email uniqueness
            email_to_use = customer_email if customer_email else f"{customer_phone}@temp.com"
            if customer_email:
                try:
                    # Check if email already exists
                    Customer.objects.get(email=customer_email)
                    # Email exists, use a different one
                    email_to_use = f"{customer_phone}@temp.com"
                except Customer.DoesNotExist:
                    # Email is available
                    pass

            try:
                customer = Customer.objects.create(
                    first_name=first_name,
                    last_name=last_name,
                    phone=customer_phone,
                    email=email_to_use,
                    address=address_text,
                    gender='O'  # Default to Other
                )
            except IntegrityError:
                # Handle case where phone might have been created between check and create
                customer = Customer.objects.get(phone=customer_phone)

        # Build shipping address JSON
        shipping_address_data = request.data.get('shipping_address') or {}
        
        # Calculate total amount
        items_subtotal = sum(
            float(item.get('quantity', 0)) * float(item.get('unit_price', 0)) - float(item.get('discount', 0) or 0)
            for item in items
        )
        delivery_charge = float(request.data.get('delivery_charge', 0) or 0)
        total_amount = Decimal(str(items_subtotal + delivery_charge))

        # Create preorder
        preorder_data = {
            'customer_name': customer_name,
            'customer_phone': customer_phone,
            'customer_email': customer_email if customer_email else '',
            'source': 'ONLINE',
            'payment_method': 'COD',
            'preorder_type': 'online',
            'items': items,
            'shipping_address': shipping_address_data if shipping_address_data else None,
            'delivery_charge': Decimal(str(delivery_charge)),
            'delivery_method': str(request.data.get('delivery_method') or ''),
            'total_amount': total_amount,
            'notes': request.data.get('notes', '') or '',
            'status': 'PENDING',
        }

        # Handle expected_delivery_date if provided
        expected_delivery_date = request.data.get('expected_delivery_date')
        if expected_delivery_date:
            try:
                # Parse date string if it's a string
                if isinstance(expected_delivery_date, str):
                    preorder_data['expected_delivery_date'] = datetime.strptime(expected_delivery_date, '%Y-%m-%d').date()
                else:
                    preorder_data['expected_delivery_date'] = expected_delivery_date
            except (ValueError, TypeError):
                # Invalid date format, skip it
                pass

        try:
            preorder = Preorder.objects.create(**preorder_data)
            serializer = PreorderSerializer(preorder)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': f'Failed to create preorder: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
