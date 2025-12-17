from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from io import BytesIO
from apps.inventory.models import Product, Category
from apps.ecommerce.models import HeroSlide
from decimal import Decimal

class ImageOptimizationTest(TestCase):
    def setUp(self):
        # Create a category required for product
        self.category = Category.objects.create(name="Test Category", slug="test-category")

    def create_test_image(self, width=2000, height=2000, format='JPEG'):
        """Create a dummy image for testing"""
        file = BytesIO()
        image = Image.new('RGB', (width, height), 'red')
        image.save(file, format)
        file.seek(0)
        return SimpleUploadedFile(f"test_image.{format.lower()}", file.read(), content_type=f"image/{format.lower()}")

    def test_product_image_optimization(self):
        """Test that product images are resized and converted to WebP"""
        image = self.create_test_image(width=2000, height=2000)
        
        product = Product.objects.create(
            name="Test Product",
            category=self.category,
            cost_price=Decimal("10.00"),
            selling_price=Decimal("20.00"),
            image=image
        )
        
        # Reload from db to ensure we are checking saved file
        product.refresh_from_db()
        
        # Check extension
        self.assertTrue(product.image.name.endswith('.webp'), f"Image name {product.image.name} does not end with .webp")
        
        # Check dimensions
        with Image.open(product.image) as img:
            self.assertLessEqual(img.width, 1080)
            self.assertLessEqual(img.height, 1080)
            self.assertEqual(img.format, "WEBP")
            
    def test_hero_slide_optimization(self):
        """Test that hero slide images are optimized"""
        image = self.create_test_image(width=3000, height=1500)
        
        slide = HeroSlide.objects.create(
            title="Test Slide",
            image=image
        )
        
        slide.refresh_from_db()
        
        # Check extension
        self.assertTrue(slide.image.name.endswith('.webp'))
        
        # Check dimensions (Hero max is 1920)
        with Image.open(slide.image) as img:
            self.assertLessEqual(img.width, 1920)
            self.assertEqual(img.format, "WEBP")
