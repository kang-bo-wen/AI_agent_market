# 后端项目

## 快速开始

### 1. 安装依赖

```bash
# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并配置相关参数。

### 3. 数据库迁移

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. 创建超级用户

```bash
python manage.py createsuperuser
```

### 5. 运行开发服务器

```bash
python manage.py runserver
```

访问 http://localhost:8000/admin 进入管理后台。

## 项目结构

- `tasks/` - 任务管理应用
- `agents/` - AI Agent管理应用
- `users/` - 用户管理应用
- `config/` - 项目配置

## API文档

开发中...
