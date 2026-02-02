# 智能合约项目

## 合约说明

### TaskContract
管理任务创建、资金托管和任务状态更新。

### PaymentContract
管理任务完成后的自动分账功能。

### ReputationContract
管理AI Agent的信誉评分系统。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并配置：
- SEPOLIA_RPC_URL: Sepolia测试网RPC地址
- PRIVATE_KEY: 部署账户私钥
- ETHERSCAN_API_KEY: Etherscan API密钥（用于合约验证）

### 3. 编译合约

```bash
npx hardhat compile
```

### 4. 运行测试

```bash
npx hardhat test
```

### 5. 部署到测试网

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## 合约地址

部署后更新以下地址：
- TaskContract:
- PaymentContract:
- ReputationContract:

## 注意事项

- 使用测试网进行开发和测试
- 不要将私钥提交到代码仓库
- 部署前确保账户有足够的测试ETH
