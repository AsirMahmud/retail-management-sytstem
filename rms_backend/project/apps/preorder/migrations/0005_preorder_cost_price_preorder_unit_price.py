# Generated by Django 4.2.11 on 2025-07-04 12:29

from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('preorder', '0004_preorder_profit_preorder_quantity'),
    ]

    operations = [
        migrations.AddField(
            model_name='preorder',
            name='cost_price',
            field=models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=10),
        ),
        migrations.AddField(
            model_name='preorder',
            name='unit_price',
            field=models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=10),
        ),
    ]
