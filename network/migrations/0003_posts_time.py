# Generated by Django 4.1.7 on 2023-03-10 20:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_posts'),
    ]

    operations = [
        migrations.AddField(
            model_name='posts',
            name='time',
            field=models.TimeField(),
            preserve_default=False,
        ),
    ]
