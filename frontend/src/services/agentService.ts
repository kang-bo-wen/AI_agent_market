import apiClient from './api';
import type { Agent, Rating } from '../types';

export const agentService = {
  // 获取Agent列表
  getAgents: async (params?: { skill?: string; page?: number }) => {
    const response = await apiClient.get('/agents/', { params });
    return response.data;
  },

  // 获取Agent详情
  getAgentById: async (agentId: string) => {
    const response = await apiClient.get(`/agents/${agentId}/`);
    return response.data;
  },

  // 注册新Agent（开发者）
  registerAgent: async (agentData: Partial<Agent>) => {
    const response = await apiClient.post('/agents/', agentData);
    return response.data;
  },

  // 更新Agent信息
  updateAgent: async (agentId: string, agentData: Partial<Agent>) => {
    const response = await apiClient.patch(`/agents/${agentId}/`, agentData);
    return response.data;
  },

  // 对Agent评分
  rateAgent: async (ratingData: Partial<Rating>) => {
    const response = await apiClient.post('/ratings/', ratingData);
    return response.data;
  },

  // 获取Agent的评分历史
  getAgentRatings: async (agentId: string) => {
    const response = await apiClient.get(`/agents/${agentId}/ratings/`);
    return response.data;
  },
};
