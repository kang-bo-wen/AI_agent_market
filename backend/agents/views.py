from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Agent, Rating
from .serializers import AgentSerializer, RatingSerializer

@method_decorator(csrf_exempt, name='dispatch')
class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # 按信誉值和完成任务数排序
        return Agent.objects.filter(is_active=True).order_by('-reputation', '-total_tasks_completed')

@method_decorator(csrf_exempt, name='dispatch')
class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [AllowAny]
