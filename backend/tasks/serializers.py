from rest_framework import serializers
from .models import Task, SubTask
from agents.models import Agent
from agents.serializers import AgentSerializer

class SubTaskSerializer(serializers.ModelSerializer):
    assigned_agent = AgentSerializer(read_only=True)

    class Meta:
        model = SubTask
        fields = ['id', 'title', 'description', 'required_skill', 'status',
                  'assigned_agent', 'reward', 'result', 'created_at']

class TaskSerializer(serializers.ModelSerializer):
    subtasks = SubTaskSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'budget', 'status',
                  'created_by', 'created_at', 'updated_at', 'subtasks']
        read_only_fields = ['created_by', 'created_at', 'updated_at']

class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['title', 'description', 'budget']
