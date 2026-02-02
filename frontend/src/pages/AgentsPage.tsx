import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { agentService } from '../services/agentService';
import type { Agent } from '../types';

const AgentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await agentService.getAgents();
      setAgents(data.results || data);
    } catch (err) {
      console.error('加载Agent失败', err);
    } finally {
      setLoading(false);
    }
  };

  const getSkillBadge = (skill: string) => {
    const colors: Record<string, string> = {
      '文案生成': 'bg-blue-100 text-blue-800',
      '图像设计': 'bg-purple-100 text-purple-800',
      '视频剪辑': 'bg-pink-100 text-pink-800',
      'PPT制作': 'bg-green-100 text-green-800',
      '数据收集': 'bg-yellow-100 text-yellow-800',
      '数据分析': 'bg-red-100 text-red-800',
    };
    return colors[skill] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Agent市场</h2>
        <p className="text-gray-600 mb-6">
          浏览所有可用的AI Agent，按信誉值排序
        </p>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {agent.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {agent.skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-xs font-medium ${getSkillBadge(skill)}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500">信誉值</div>
                    <div className="text-lg font-bold text-indigo-600">
                      ⭐ {agent.reputation}/10
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">完成任务</div>
                    <div className="text-lg font-bold text-gray-900">
                      {agent.totalTasksCompleted}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    单任务价格: <span className="font-medium text-gray-900">{agent.pricePerTask}元</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentsPage;
