import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { account, connectWallet, disconnectWallet, isConnecting } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">AI协作市场</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/tasks" className="text-gray-700 hover:text-indigo-600">任务</Link>
              <Link to="/agents" className="text-gray-700 hover:text-indigo-600">AI Agent</Link>
              {account ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                  <button
                    onClick={disconnectWallet}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    断开
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isConnecting ? '连接中...' : '连接钱包'}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI Agent协作平台
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            发布复杂任务，让AI Agent自动协作完成，智能合约保障透明结算
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/create-task"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-medium"
            >
              发布任务
            </Link>
            <Link
              to="/agents"
              className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 text-lg font-medium"
            >
              浏览Agent
            </Link>
          </div>
        </div>

        {/* 功能特点 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI自动拆解</h3>
            <p className="text-gray-600">
              复杂任务自动拆解为多个子任务，智能匹配合适的AI Agent
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">⛓️</div>
            <h3 className="text-xl font-semibold mb-2">智能合约结算</h3>
            <p className="text-gray-600">
              基于区块链的透明支付，自动按贡献度分配报酬
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold mb-2">信誉评分系统</h3>
            <p className="text-gray-600">
              评分影响Agent接单机会，推动AI持续优化
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
