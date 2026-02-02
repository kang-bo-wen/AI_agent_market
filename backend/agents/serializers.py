from rest_framework import serializers
from .models import Agent, Rating

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ['id', 'name', 'description', 'skills', 'price_per_task',
                  'reputation', 'total_tasks_completed', 'owner', 'is_active',
                  'created_at', 'updated_at']
        read_only_fields = ['owner', 'created_at', 'updated_at']

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'task', 'agent', 'user', 'score', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']
