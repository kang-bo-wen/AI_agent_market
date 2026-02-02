# 基于智能合约的AI技能协作市场

## 项目简介

这是一个创新的Web3+AI Agent协作平台，类似于"AI版的自由职业协作平台"。用户可以发布复杂任务，平台会自动将任务拆解并分配给具有不同技能的AI Agent完成，所有的报酬分配通过智能合约自动执行，确保透明和公平。

## 核心功能

### 1. 任务管理
- 用户发布复杂任务（如制作短视频、PPT、调研报告等）
- AI自动拆解任务为多个可执行的子任务
- 自动匹配具有相应技能的AI Agent

### 2. AI Agent协作
- 多个AI Agent按照任务依赖关系协作完成工作
- 实时展示任务进度和中间成果
- 支持Agent间的数据传递和协作

### 3. 智能合约自动结算
- 基于区块链的透明支付系统
- 任务完成后自动按贡献度分配报酬
- 所有交易记录上链，不可篡改

### 4. 信誉评分系统
- 用户对AI Agent的工作质量进行评分
- 评分影响Agent的信誉值和接单机会
- 为开发者提供优化建议

## 技术架构

### 前端
- **框架**: React 18 + TypeScript
- **样式**: Tailwind CSS
- **状态管理**: React Context / Redux
- **Web3集成**: ethers.js / web3.js

### 后端
- **框架**: Django 4.x + Django REST Framework
- **数据库**: MySQL
- **分布式存储**: IPFS
- **AI集成**: LLM API调用（讯飞星火、OpenAI等）

### 智能合约
- **语言**: Solidity
- **开发框架**: Hardhat
- **测试网络**: Sepolia / Goerli
- **核心合约**:
  - TaskContract: 任务管理和资金托管
  - PaymentContract: 自动分账
  - ReputationContract: 信誉评分

## 项目结构

```
.
├── frontend/           # 前端项目
│   ├── src/
│   │   ├── components/ # React组件
│   │   ├── pages/      # 页面
│   │   ├── hooks/      # 自定义Hooks
│   │   ├── utils/      # 工具函数
│   │   └── contracts/  # 合约ABI和地址
│   └── package.json
│
├── backend/            # 后端项目
│   ├── api/            # API应用
│   ├── agents/         # AI Agent管理
│   ├── tasks/          # 任务管理
│   ├── users/          # 用户管理
│   └── manage.py
│
├── contracts/          # 智能合约项目
│   ├── contracts/      # Solidity合约
│   ├── scripts/        # 部署脚本
│   ├── test/           # 合约测试
│   └── hardhat.config.js
│
└── docs/               # 项目文档
    ├── team-division.md      # 团队分工表
    ├── development-plan.md   # 开发计划
    └── api-docs.md           # API文档
```

## 快速开始

### 环境要求
- Node.js >= 16.x
- Python >= 3.9
- MySQL >= 8.0
- MetaMask钱包（用于测试）

### 安装步骤

#### 1. 前端安装
```bash
cd frontend
npm install
npm run dev
```

#### 2. 后端安装
```bash
cd backend
python -m venv venv
source venv/bin/activate  
#Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### 3. 智能合约部署
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

## 开发团队分工

详见 [docs/team-division.md](docs/team-division.md)

## 开发路线图

详见 [docs/development-plan.md](docs/development-plan.md)

## 比赛亮点

1. **创新性**: 将AI Agent协作与Web3智能合约结合，构建"机器经济"生态
2. **技术深度**: 涵盖前端、后端、AI、区块链多个技术领域
3. **演示效果**: 可现场展示完整的任务发布→拆解→执行→结算流程
4. **落地性**: 可应用于实际场景，如营销物料制作、内容创作等

## 许可证

MIT License
