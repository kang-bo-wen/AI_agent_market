import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import type { Task } from '../types';

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (id) {
      loadTask(id);
    }
  }, [id]);

  const loadTask = async (taskId: string) => {
    try {
      setLoading(true);
      const data = await taskService.getTaskById(taskId);
      setTask(data);
    } catch (err: any) {
      setError('加载任务失败');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!task || !id) return;

    if (confirm('确认任务已完成？')) {
      try {
        await taskService.confirmTaskCompletion(id);
        setShowRating(true); // 先设置显示评分界面
        await loadTask(id); // 等待任务数据加载完成
        alert('任务已完成！请为每个Agent评分');
      } catch (err) {
        alert('操作失败，请重试');
      }
    }
  };

  const handleRating = (subtaskId: string, score: number) => {
    setRatings({ ...ratings, [subtaskId]: score });
  };

  const submitRatings = async () => {
    if (!task || !id) return;

    try {
      // 调用后端接口提交评分
      const result = await taskService.submitRatings(id, ratings);

      const avgScore = Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length;

      // 显示更新结果
      let message = `评分已提交！\n\n平均分：${avgScore.toFixed(1)}分\n\n`;

      if (result.updated_agents && result.updated_agents.length > 0) {
        message += '信誉值更新：\n';
        result.updated_agents.forEach((agent: any) => {
          message += `\n${agent.agent_name}:\n`;
          message += `  评分: ${agent.score}分\n`;
          message += `  信誉: ${agent.old_reputation} → ${agent.new_reputation}\n`;
        });
        message += '\n✓ 高分Agent将获得更多任务推荐\n';
        message += '✓ 信誉值已更新到市场列表';
      }

      alert(message);
      setShowRating(false);

      // 刷新任务数据
      loadTask(id);
    } catch (err) {
      alert('评分提交失败，请重试');
      console.error('提交评分失败', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: '待处理', className: 'bg-yellow-100 text-yellow-800' },
      in_progress: { label: '进行中', className: 'bg-blue-100 text-blue-800' },
      completed: { label: '已完成', className: 'bg-green-100 text-green-800' },
      cancelled: { label: '已取消', className: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '任务不存在'}</p>
          <button
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            返回任务列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-indigo-600">AI协作市场</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/tasks')}
                className="text-gray-700 hover:text-indigo-600"
              >
                ← 返回列表
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 任务基本信息 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
              <p className="text-gray-600">{task.description}</p>
            </div>
            {getStatusBadge(task.status)}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div>
              <div className="text-sm text-gray-500">预算</div>
              <div className="text-lg font-semibold text-indigo-600">{task.budget}元</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">子任务数</div>
              <div className="text-lg font-semibold">{task.subtasks?.length || 0}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">已完成</div>
              <div className="text-lg font-semibold text-green-600">
                {task.subtasks?.filter(st => st.status === 'completed').length || 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">创建时间</div>
              <div className="text-sm">{new Date(task.createdAt).toLocaleString()}</div>
            </div>
          </div>

          {task.status !== 'completed' && task.status !== 'cancelled' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleComplete}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                ✓ 确认任务完成
              </button>
            </div>
          )}
        </div>

        {/* 子任务列表 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            子任务详情 ({task.subtasks?.length || 0})
          </h3>

          {task.subtasks && task.subtasks.length > 0 ? (
            <div className="space-y-4">
              {task.subtasks.map((subtask, index) => (
                <div
                  key={subtask.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{subtask.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{subtask.description}</p>
                      </div>
                    </div>
                    {getStatusBadge(subtask.status)}
                  </div>

                  <div className="ml-11 mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">所需技能: </span>
                      <span className="font-medium text-gray-900">{subtask.requiredSkill}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">报酬: </span>
                      <span className="font-medium text-indigo-600">{subtask.reward}元</span>
                    </div>
                  </div>

                  {/* 显示分配的Agent */}
                  {subtask.assignedAgent && (
                    <div className="ml-11 mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-indigo-900">
                            🤖 分配Agent: {subtask.assignedAgent.name}
                          </div>
                          <div className="text-xs text-indigo-700 mt-1">
                            信誉: ⭐ {subtask.assignedAgent.reputation}/10 |
                            已完成: {subtask.assignedAgent.totalTasksCompleted}个任务
                          </div>
                        </div>
                        <div className="text-xs text-indigo-600 bg-white px-2 py-1 rounded">
                          优先匹配
                        </div>
                      </div>
                    </div>
                  )}

                  {subtask.result && (
                    <div className="ml-11 mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
                      <div className="text-green-800 font-medium mb-1">执行结果:</div>
                      <div className="text-green-700">{subtask.result}</div>
                    </div>
                  )}

                  {/* 评分界面 */}
                  {showRating && task.status === 'completed' && subtask.assignedAgent && (
                    <div className="ml-11 mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="mb-3 pb-3 border-b border-yellow-300">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          为 <span className="text-indigo-600 font-bold">{subtask.assignedAgent.name}</span> 评分
                        </div>
                        <div className="text-xs text-gray-600">
                          当前信誉: ⭐ {subtask.assignedAgent.reputation}/10 |
                          你的评分将直接影响该Agent的信誉值和排序
                        </div>
                      </div>
                      <div className="text-xs text-gray-700 mb-2 font-medium">
                        请选择评分（1-10分）：
                      </div>
                      <div className="flex items-center space-x-2">{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                          <button
                            key={score}
                            onClick={() => handleRating(subtask.id, score)}
                            className={`w-8 h-8 rounded-full text-sm font-medium transition ${
                              ratings[subtask.id] === score
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:border-indigo-400'
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                      {ratings[subtask.id] && subtask.assignedAgent && (
                        <div className="mt-3 p-2 bg-white border border-yellow-300 rounded">
                          <div className="text-sm font-medium text-gray-900">
                            ✓ 已为 <span className="text-indigo-600">{subtask.assignedAgent.name}</span> 评分: <span className="text-lg font-bold text-indigo-600">{ratings[subtask.id]}</span>分
                          </div>
            
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">暂无子任务</p>
          )}

          {/* 提交评分按钮 */}
          {showRating && task.status === 'completed' && Object.keys(ratings).length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={submitRatings}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
              >
                ⭐ 提交（{Object.keys(ratings).length}/{task.subtasks?.length || 0}个Agent已评分）
              </button>
              <p className="mt-3 text-sm text-gray-600 text-center">
                💡 你的评分将立即更新Agent的信誉值，影响它们在市场中的排序和未来接单机会
              </p>
              
            </div>
          )}
        </div>

        {/* 演示说明 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">💡 演示说明</h4>
          <p className="text-sm text-blue-800">
            这是一个简化的演示版本。实际应用中，子任务会由真实的AI Agent执行，
            并通过智能合约自动分配报酬。当前版本使用模拟数据展示核心流程。
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
