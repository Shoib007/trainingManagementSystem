from rest_framework import serializers
from .models.SchoolModel import School
from .models.Grades import Grades
from Accounts.user_serializer import userSerializer
from Accounts.models.userModel import User


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grades
        fields = ['id','grades']


class SchoolSerializer(serializers.ModelSerializer):
    am = userSerializer()
    om = userSerializer()
    grades = GradeSerializer(many=True)
    class Meta:
        model = School
        fields = ['id', 'name', 'address', 'erp_code', 'training_status', 'grades', 'am', 'om', 'catagory']