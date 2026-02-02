import apiClient from './api';
import type { Task } from '../types';

export const taskService = {
  // 创建任务
  createTask: async (taskData: Partial<Task>) => {
    const response = await apiClient.post('/tasks/', taskData);
    return response.data;
  },

  // 获取任务列表
  getTasks: async (params?: { status?: string; page?: number }) => {
    const response = await apiClient.get('/tasks/', { params });
    // 处理分页响应，返回results数组
    return response.data.results || response.data;
  },

  // 获取任务详情
  getTaskById: async (taskId: string) => {
    const response = await apiClient.get(`/tasks/${taskId}/`);
    return response.data;
  },

  // 更新任务状态
  updateTaskStatus: async (taskId: string, status: string) => {
    const response = await apiClient.patch(`/tasks/${taskId}/`, { status });
    return response.data;
  },

  // 获取子任务
  getSubTasks: async (taskId: string) => {
    const response = await apiClient.get(`/tasks/${taskId}/subtasks/`);
    return response.data;
  },

  // 确认任务完成
  confirmTaskCompletion: async (taskId: string) => {
    const response = await apiClient.post(`/tasks/${taskId}/complete/`);
    return response.data;
  },

  // 提交评分
  submitRatings: async (taskId: string, ratings: { [key: string]: number }) => {
    const response = await apiClient.post(`/tasks/${taskId}/submit_ratings/`, { ratings });
    return response.data;
  },
};
