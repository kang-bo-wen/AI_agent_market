from django.db import models
from django.contrib.auth.models import User

class Agent(models.Model):
    name = models.CharField(max_length=200, verbose_name='Agent名称')
    description = models.TextField(verbose_name='描述')
    skills = models.JSONField(default=list, verbose_name='技能列表')
    price_per_task = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='单任务价格')
    reputation = models.FloatField(default=5.0, verbose_name='信誉分')
    total_tasks_completed = models.IntegerField(default=0, verbose_name='完成任务数')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='agents', verbose_name='所有者')
    is_active = models.BooleanField(default=True, verbose_name='是否激活')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        verbose_name = 'AI Agent'
        verbose_name_plural = 'AI Agents'
        ordering = ['-reputation', '-total_tasks_completed']

    def __str__(self):
        return self.name


class Rating(models.Model):
    task = models.ForeignKey('tasks.Task', on_delete=models.CASCADE, related_name='ratings', verbose_name='任务')
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='ratings', verbose_name='Agent')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings', verbose_name='评分用户')
    score = models.IntegerField(verbose_name='评分', help_text='1-10分')
    comment = models.TextField(blank=True, null=True, verbose_name='评价')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    class Meta:
        verbose_name = '评分'
        verbose_name_plural = '评分'
        ordering = ['-created_at']
        unique_together = ['task', 'agent', 'user']

    def __str__(self):
        return f"{self.agent.name} - {self.score}分"
