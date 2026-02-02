from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Task, SubTask
from .serializers import TaskSerializer, TaskCreateSerializer
from agents.models import Agent
from decimal import Decimal
import random

@method_decorator(csrf_exempt, name='dispatch')
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'create':
            return TaskCreateSerializer
        return TaskSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 创建任务（使用匿名用户或第一个用户）
        from django.contrib.auth.models import User
        user = request.user if request.user.is_authenticated else User.objects.first()
        if not user:
            # 如果没有用户，创建一个默认用户
            user = User.objects.create_user(username='demo_user', password='demo123')

        task = serializer.save(created_by=user)

        # 简化版：根据任务描述自动拆解（使用预设模板）
        self._auto_split_task(task)

        # 返回完整的任务信息（包含子任务）
        response_serializer = TaskSerializer(task)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def _auto_split_task(self, task):
        """
        简化版任务拆解：使用预设模板
        根据关键词判断任务类型，生成对应的子任务
        """
        description_lower = task.description.lower()

        # 预设模板1：短视频制作
        if '视频' in description_lower or 'video' in description_lower:
            subtasks_template = [
                {
                    'title': '编写视频脚本',
                    'description': f'为"{task.title}"编写30秒短视频脚本',
                    'required_skill': '文案生成',
                    'reward': task.budget * Decimal('0.3')
                },
                {
                    'title': '设计宣传图片',
                    'description': f'为"{task.title}"设计2-3张宣传图片',
                    'required_skill': '图像设计',
                    'reward': task.budget * Decimal('0.4')
                },
                {
                    'title': '视频剪辑制作',
                    'description': f'将脚本和图片剪辑成30秒短视频',
                    'required_skill': '视频剪辑',
                    'reward': task.budget * Decimal('0.3')
                }
            ]
        # 预设模板2：PPT制作
        elif 'ppt' in description_lower or '演示' in description_lower or '幻灯片' in description_lower:
            subtasks_template = [
                {
                    'title': '撰写PPT大纲',
                    'description': f'为"{task.title}"撰写PPT内容大纲',
                    'required_skill': '文案生成',
                    'reward': task.budget * Decimal('0.3')
                },
                {
                    'title': '设计PPT模板',
                    'description': f'设计符合主题的PPT模板和配色',
                    'required_skill': '图像设计',
                    'reward': task.budget * Decimal('0.3')
                },
                {
                    'title': '制作完整PPT',
                    'description': f'根据大纲和模板制作完整PPT',
                    'required_skill': 'PPT制作',
                    'reward': task.budget * Decimal('0.4')
                }
            ]
        # 预设模板3：调研报告
        elif '调研' in description_lower or '报告' in description_lower or '分析' in description_lower:
            subtasks_template = [
                {
                    'title': '数据收集',
                    'description': f'收集"{task.title}"相关的数据和资料',
                    'required_skill': '数据收集',
                    'reward': task.budget * Decimal('0.3')
                },
                {
                    'title': '数据分析',
                    'description': f'分析收集的数据，提取关键信息',
                    'required_skill': '数据分析',
                    'reward': task.budget * Decimal('0.4')
                },
                {
                    'title': '撰写报告',
                    'description': f'撰写完整的调研报告文档',
                    'required_skill': '文案生成',
                    'reward': task.budget * Decimal('0.3')
                }
            ]
        # 默认模板：通用任务
        else:
            subtasks_template = [
                {
                    'title': '需求分析',
                    'description': f'分析"{task.title}"的具体需求',
                    'required_skill': '需求分析',
                    'reward': task.budget * Decimal('0.2')
                },
                {
                    'title': '方案设计',
                    'description': f'设计"{task.title}"的实现方案',
                    'required_skill': '方案设计',
                    'reward': task.budget * Decimal('0.3')
                },
                {
                    'title': '执行实施',
                    'description': f'执行并完成"{task.title}"',
                    'required_skill': '任务执行',
                    'reward': task.budget * Decimal('0.5')
                }
            ]

        # 创建子任务并分配Agent
        for subtask_data in subtasks_template:
            # 根据所需技能匹配Agent（优先选择高声望的）
            required_skill = subtask_data['required_skill']

            # 获取所有激活的Agent，然后在Python中过滤（兼容SQLite）
            best_agent = None
            for agent in Agent.objects.filter(is_active=True).order_by('-reputation', '-total_tasks_completed'):
                if required_skill in agent.skills:
                    best_agent = agent
                    break

            SubTask.objects.create(
                task=task,
                assigned_agent=best_agent,
                **subtask_data
            )

    @action(detail=True, methods=['post'])
    def simulate_progress(self, request, pk=None):
        """
        模拟任务执行进度（用于演示）
        """
        task = self.get_object()
        subtasks = task.subtasks.all()

        # 随机更新一些子任务的状态
        for subtask in subtasks:
            if subtask.status == 'pending':
                subtask.status = 'in_progress'
                subtask.save()
                break

        serializer = self.get_serializer(task)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """
        完成任务
        """
        task = self.get_object()
        task.status = 'completed'
        task.save()

        # 将所有子任务标记为完成
        task.subtasks.update(status='completed', result='任务已完成（演示数据）')

        serializer = self.get_serializer(task)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def submit_ratings(self, request, pk=None):
        """
        提交评分并更新Agent信誉值
        """
        task = self.get_object()
        ratings_data = request.data.get('ratings', {})  # {subtask_id: score}

        if not ratings_data:
            return Response({'error': '评分数据不能为空'}, status=status.HTTP_400_BAD_REQUEST)

        updated_agents = []

        for subtask_id, score in ratings_data.items():
            try:
                subtask = task.subtasks.get(id=subtask_id)
                if subtask.assigned_agent:
                    agent = subtask.assigned_agent

                    # 更新Agent信誉值（简化算法：加权平均）
                    # 新信誉 = (旧信誉 * 完成任务数 + 新评分) / (完成任务数 + 1)
                    old_reputation = agent.reputation
                    old_count = agent.total_tasks_completed

                    new_reputation = (old_reputation * old_count + float(score)) / (old_count + 1)
                    agent.reputation = round(new_reputation, 1)
                    agent.total_tasks_completed += 1
                    agent.save()

                    updated_agents.append({
                        'agent_id': agent.id,
                        'agent_name': agent.name,
                        'old_reputation': old_reputation,
                        'new_reputation': agent.reputation,
                        'score': score
                    })

            except SubTask.DoesNotExist:
                continue

        return Response({
            'message': '评分提交成功',
            'updated_agents': updated_agents
        }, status=status.HTTP_200_OK)
