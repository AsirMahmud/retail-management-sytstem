from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecommerce', '0003_deliverysettings_inside_gazipur_charge'),
    ]

    operations = [
        migrations.AddField(
            model_name='homepagesettings',
            name='footer_tagline',
            field=models.CharField(
                max_length=255,
                null=True,
                blank=True,
                help_text='Short tagline shown under the footer logo',
            ),
        ),
        migrations.AddField(
            model_name='homepagesettings',
            name='footer_address',
            field=models.TextField(
                null=True,
                blank=True,
                help_text='Store address shown in the footer. Supports multiple lines.',
            ),
        ),
        migrations.AddField(
            model_name='homepagesettings',
            name='footer_phone',
            field=models.CharField(
                max_length=50,
                null=True,
                blank=True,
                help_text='Primary contact phone number for the footer.',
            ),
        ),
        migrations.AddField(
            model_name='homepagesettings',
            name='footer_email',
            field=models.EmailField(
                max_length=254,
                null=True,
                blank=True,
                help_text='Primary contact email address for the footer.',
            ),
        ),
        migrations.AddField(
            model_name='homepagesettings',
            name='footer_facebook_url',
            field=models.URLField(
                null=True,
                blank=True,
                help_text='Facebook page URL for the footer social links.',
            ),
        ),
        migrations.AddField(
            model_name='homepagesettings',
            name='footer_instagram_url',
            field=models.URLField(
                null=True,
                blank=True,
                help_text='Instagram page URL for the footer social links.',
            ),
        ),
        migrations.AddField(
            model_name='homepagesettings',
            name='footer_twitter_url',
            field=models.URLField(
                null=True,
                blank=True,
                help_text='Twitter/X profile URL for the footer social links.',
            ),
        ),
        migrations.AddField(
            model_name='homepagesettings',
            name='footer_github_url',
            field=models.URLField(
                null=True,
                blank=True,
                help_text='GitHub profile or organization URL for the footer social links.',
            ),
        ),
        migrations.AddField(
            model_name='homepagesettings',
            name='footer_map_embed_url',
            field=models.TextField(
                null=True,
                blank=True,
                help_text='Google Maps embed URL used for the footer map preview.',
            ),
        ),
    ]


