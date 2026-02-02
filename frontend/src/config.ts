// API基础配置
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// 区块链配置
export const CHAIN_CONFIG = {
  chainId: '0xaa36a7', // Sepolia测试网
  chainName: 'Sepolia',
  rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_KEY'],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

// 合约地址（部署后更新）
export const CONTRACT_ADDRESSES = {
  TaskContract: '',
  PaymentContract: '',
  ReputationContract: '',
};
