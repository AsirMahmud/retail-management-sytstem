# Generated by Django 4.2.11 on 2025-07-04 09:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('preorder', '0002_alter_preorderproduct_estimated_price'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='preorder',
            name='quantity',
        ),
        migrations.RemoveField(
            model_name='preorder',
            name='variation',
        ),
        migrations.AddField(
            model_name='preorder',
            name='items',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
