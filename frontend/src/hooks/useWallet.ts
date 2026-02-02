import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 连接钱包
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('请安装MetaMask钱包');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);

      setProvider(provider);
      setAccount(accounts[0]);
    } catch (err: any) {
      setError(err.message || '连接钱包失败');
    } finally {
      setIsConnecting(false);
    }
  };

  // 断开钱包
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
  };

  // 监听账户变化
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return {
    account,
    provider,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
  };
};
