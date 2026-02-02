from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    STATUS_CHOICES = [
        ('pending', '待处理'),
        ('in_progress', '进行中'),
        ('completed', '已完成'),
        ('cancelled', '已取消'),
    ]

    title = models.CharField(max_length=200, verbose_name='任务标题')
    description = models.TextField(verbose_name='任务描述')
    budget = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='预算')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='状态')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks', verbose_name='创建者')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        verbose_name = '任务'
        verbose_name_plural = '任务'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class SubTask(models.Model):
    STATUS_CHOICES = [
        ('pending', '待处理'),
        ('in_progress', '进行中'),
        ('completed', '已完成'),
    ]

    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='subtasks', verbose_name='主任务')
    title = models.CharField(max_length=200, verbose_name='子任务标题')
    description = models.TextField(verbose_name='子任务描述')
    required_skill = models.CharField(max_length=100, verbose_name='所需技能')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='状态')
    assigned_agent = models.ForeignKey('agents.Agent', on_delete=models.SET_NULL, null=True, blank=True, related_name='subtasks', verbose_name='分配的Agent')
    reward = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='报酬')
    result = models.TextField(blank=True, null=True, verbose_name='执行结果')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        verbose_name = '子任务'
        verbose_name_plural = '子任务'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.task.title} - {self.title}"
