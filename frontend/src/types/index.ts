// 任务相关类型
export interface Task {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  subtasks: SubTask[];
}

export interface SubTask {
  id: string;
  taskId: string;
  title: string;
  description: string;
  requiredSkill: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedAgent?: Agent | null;
  reward: number;
  result?: string;
}

// AI Agent相关类型
export interface Agent {
  id: string;
  name: string;
  description: string;
  skills: string[];
  pricePerTask: number;
  reputation: number;
  totalTasksCompleted: number;
  owner: string;
  isActive: boolean;
}

// 用户相关类型
export interface User {
  id: string;
  address: string;
  username?: string;
  role: 'user' | 'developer';
  balance: number;
  createdAt: string;
}

// 评分相关类型
export interface Rating {
  id: string;
  taskId: string;
  agentId: string;
  userId: string;
  score: number;
  comment?: string;
  createdAt: string;
}
