# Generated migration for adding delivery_charge and delivery_method fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('preorder', '0007_preorder_payment_method_preorder_preorder_type_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='preorder',
            name='delivery_charge',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Delivery charge for online orders', max_digits=10),
        ),
        migrations.AddField(
            model_name='preorder',
            name='delivery_method',
            field=models.CharField(blank=True, help_text='Inside Dhaka or Outside Dhaka', max_length=20, null=True),
        ),
    ]





