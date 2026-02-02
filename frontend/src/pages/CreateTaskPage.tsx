import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';

const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const task = await taskService.createTask({
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
      });

      // 创建成功，跳转到任务详情页
      alert('任务创建成功！系统已自动拆解任务');
      navigate(`/tasks/${task.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || '创建任务失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 示例任务模板
  const examples = [
    {
      title: '制作美白面膜推广短视频',
      description: '需要制作一个30秒的短视频，风格活泼，突出平价、无刺激的特点',
      budget: '100',
    },
    {
      title: '制作产品介绍PPT',
      description: '为新产品发布会制作一份20页的PPT，风格专业简洁',
      budget: '80',
    },
    {
      title: '市场调研报告',
      description: '针对美妆行业进行市场调研，分析竞品和用户需求',
      budget: '150',
    },
  ];

  const loadExample = (example: typeof examples[0]) => {
    setFormData(example);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-indigo-600">AI协作市场</h1>
            <button
              onClick={() => navigate('/')}
              className="text-gray-700 hover:text-indigo-600"
            >
              返回首页
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">发布任务</h2>
        <p className="text-gray-600 mb-8">
          描述你的需求，AI会自动拆解任务并匹配合适的Agent
        </p>

        {/* 示例任务 */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-3">快速填充示例：</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => loadExample(example)}
                className="p-3 text-left border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
              >
                <div className="text-sm font-medium text-gray-900">{example.title}</div>
                <div className="text-xs text-gray-500 mt-1">预算: {example.budget}元</div>
              </button>
            ))}
          </div>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              任务标题 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="例如：制作美白面膜推广短视频"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              任务描述 *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="详细描述你的需求，包括风格、要求等..."
            />
            <p className="mt-2 text-xs text-gray-500">
              💡 提示：包含"视频"、"PPT"、"调研"等关键词可以获得更精准的任务拆解
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              预算（元）*
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              min="1"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="100"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? '创建中...' : '发布任务'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
          </div>
        </form>

        {/* 说明 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">📋 任务发布流程</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>填写任务信息并提交</li>
            <li>AI自动分析并拆解为多个子任务</li>
            <li>系统匹配合适的Agent执行</li>
            <li>实时查看任务进度</li>
            <li>任务完成后确认并评分</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;
