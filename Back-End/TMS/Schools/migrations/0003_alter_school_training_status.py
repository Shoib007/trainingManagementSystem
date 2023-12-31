# Generated by Django 4.2.4 on 2023-11-15 11:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Schools', '0002_school_training_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='school',
            name='training_status',
            field=models.CharField(blank=True, choices=[('ONGOING', 'ONGOING'), ('COMPLETED', 'COMPLETED'), ('CANCELLED', 'CANCELLED'), ('PENDING', 'PENDING')], max_length=20, null=True),
        ),
    ]
