# Generated by Django 4.2.4 on 2023-11-12 17:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Trainings', '0002_remove_trainingsheet_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='training',
            name='endTime',
            field=models.TimeField(),
        ),
        migrations.AlterField(
            model_name='training',
            name='startTime',
            field=models.TimeField(),
        ),
    ]