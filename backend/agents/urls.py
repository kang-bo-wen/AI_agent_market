from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AgentViewSet, RatingViewSet

router = DefaultRouter()
router.register(r'agents', AgentViewSet, basename='agent')
router.register(r'ratings', RatingViewSet, basename='rating')

urlpatterns = [
    path('', include(router.urls)),
]
