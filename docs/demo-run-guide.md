# 简化Demo运行指南

## 快速启动（5分钟搞定）

### 1. 启动后端

```bash
cd backend
.\venv\Scripts\activate
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### 2. 启动前端

```bash
# 新开终端
cd frontend
npm run dev
```

---

## 演示流程（3分钟完整演示）

### 步骤1：发布任务（30秒）
1. 访问 http://localhost:5173
2. 点击"发布任务"按钮
3. 填写任务信息：
   - 标题：制作美白面膜推广短视频
   - 描述：需要制作一个30秒的短视频，风格活泼，突出平价、无刺激
   - 预算：100
4. 点击提交

### 步骤2：查看任务拆解（30秒）
- 系统自动将任务拆解为3个子任务：
  1. 编写视频脚本（30元）
  2. 设计宣传图片（40元）
  3. 视频剪辑制作（30元）

### 步骤3：模拟任务执行（1分钟）
- 展示任务进度更新
- 子任务状态变化：待处理 → 进行中 → 已完成

### 步骤4：完成任务（30秒）
- 点击"确认完成"
- 展示任务完成状态

---

## API测试（使用Postman或curl）

### 创建任务
```bash
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "制作美白面膜推广短视频",
    "description": "需要制作一个30秒的短视频，风格活泼",
    "budget": 100
  }'
```

### 获取任务列表
```bash
curl http://localhost:8000/api/tasks/
```

### 获取任务详情
```bash
curl http://localhost:8000/api/tasks/1/
```

### 模拟进度更新
```bash
curl -X POST http://localhost:8000/api/tasks/1/simulate_progress/
```

### 完成任务
```bash
curl -X POST http://localhost:8000/api/tasks/1/complete/
```

---

## 支持的任务类型

### 1. 短视频制作
关键词：视频、video
拆解为：编写脚本 → 设计图片 → 视频剪辑

### 2. PPT制作
关键词：ppt、演示、幻灯片
拆解为：撰写大纲 → 设计模板 → 制作PPT

### 3. 调研报告
关键词：调研、报告、分析
拆解为：数据收集 → 数据分析 → 撰写报告

### 4. 通用任务
其他任务
拆解为：需求分析 → 方案设计 → 执行实施

---

## 演示技巧

1. **准备多个示例任务**：提前准备2-3个不同类型的任务
2. **强调自动拆解**：重点展示AI如何自动识别任务类型并拆解
3. **展示实时更新**：演示任务进度的实时变化
4. **突出创新点**：
   - AI自动任务拆解
   - 智能Agent匹配（虽然是模拟的）
   - 透明的任务流程

---

## 下一步扩展（如果有时间）

1. **前端美化**：优化UI设计，添加动画效果
2. **实时进度**：使用WebSocket实现真实的实时更新
3. **智能合约集成**：接入真实的智能合约
4. **Agent展示**：添加Agent市场页面
5. **评分功能**：实现任务完成后的评分

---

## 常见问题

### Q: 后端启动失败？
A: 确保已经运行了数据库迁移：
```bash
python manage.py makemigrations
python manage.py migrate
```

### Q: 前端无法连接后端？
A: 检查CORS配置，确保后端settings.py中已配置：
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

### Q: 任务拆解不准确？
A: 这是简化版，使用关键词匹配。可以在views.py中调整模板。
