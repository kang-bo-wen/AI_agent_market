from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from agents.models import Agent

class Command(BaseCommand):
    help = '创建示例Agent数据用于演示'

    def handle(self, *args, **options):
        # 获取或创建默认用户
        user, _ = User.objects.get_or_create(
            username='demo_user',
            defaults={'password': 'demo123'}
        )

        # 删除旧的示例Agent
        Agent.objects.filter(owner=user).delete()

        # 创建示例Agent - 每种技能3个，形成竞争
        # 初始信誉值都是5.0，通过用户评分来改变
        agents_data = [
            # 文案生成Agent（3个）
            {'name': 'AI文案大师', 'skills': ['文案生成'], 'price': 25, 'reputation': 5.0, 'completed': 0},
            {'name': '智能写手Pro', 'skills': ['文案生成'], 'price': 28, 'reputation': 5.0, 'completed': 0},
            {'name': '创意文案助手', 'skills': ['文案生成'], 'price': 22, 'reputation': 5.0, 'completed': 0},

            # 图像设计Agent（3个）
            {'name': '视觉设计专家', 'skills': ['图像设计'], 'price': 35, 'reputation': 5.0, 'completed': 0},
            {'name': 'AI设计师Plus', 'skills': ['图像设计'], 'price': 32, 'reputation': 5.0, 'completed': 0},
            {'name': '创意设计助手', 'skills': ['图像设计'], 'price': 30, 'reputation': 5.0, 'completed': 0},

            # 视频剪辑Agent（3个）
            {'name': '专业剪辑大师', 'skills': ['视频剪辑'], 'price': 28, 'reputation': 5.0, 'completed': 0},
            {'name': '智能剪辑Pro', 'skills': ['视频剪辑'], 'price': 26, 'reputation': 5.0, 'completed': 0},
            {'name': '快速剪辑助手', 'skills': ['视频剪辑'], 'price': 24, 'reputation': 5.0, 'completed': 0},

            # PPT制作Agent（3个）
            {'name': 'PPT设计专家', 'skills': ['PPT制作'], 'price': 30, 'reputation': 5.0, 'completed': 0},
            {'name': '演示文稿大师', 'skills': ['PPT制作'], 'price': 28, 'reputation': 5.0, 'completed': 0},
            {'name': 'PPT快速助手', 'skills': ['PPT制作'], 'price': 25, 'reputation': 5.0, 'completed': 0},

            # 数据收集Agent（3个）
            {'name': '数据采集专家', 'skills': ['数据收集'], 'price': 22, 'reputation': 5.0, 'completed': 0},
            {'name': '智能爬虫Pro', 'skills': ['数据收集'], 'price': 20, 'reputation': 5.0, 'completed': 0},
            {'name': '数据收集助手', 'skills': ['数据收集'], 'price': 18, 'reputation': 5.0, 'completed': 0},

            # 数据分析Agent（3个）
            {'name': '数据分析大师', 'skills': ['数据分析'], 'price': 35, 'reputation': 5.0, 'completed': 0},
            {'name': 'AI分析师Plus', 'skills': ['数据分析'], 'price': 32, 'reputation': 5.0, 'completed': 0},
            {'name': '数据分析助手', 'skills': ['数据分析'], 'price': 28, 'reputation': 5.0, 'completed': 0},
        ]

        created_count = 0
        for data in agents_data:
            Agent.objects.create(
                name=data['name'],
                description=f"专业的{data['skills'][0]}服务，已完成{data['completed']}个任务",
                skills=data['skills'],
                price_per_task=data['price'],
                reputation=data['reputation'],
                total_tasks_completed=data['completed'],
                owner=user,
                is_active=True
            )
            created_count += 1

        self.stdout.write(
            self.style.SUCCESS(f'成功创建 {created_count} 个示例Agent')
        )
