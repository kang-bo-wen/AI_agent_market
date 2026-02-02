// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TaskContract
 * @dev 管理任务创建、资金托管和任务完成确认
 */
contract TaskContract {
    struct Task {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 budget;
        TaskStatus status;
        uint256 createdAt;
    }

    enum TaskStatus {
        Pending,
        InProgress,
        Completed,
        Cancelled
    }

    uint256 private taskCounter;
    mapping(uint256 => Task) public tasks;
    mapping(uint256 => uint256) public taskBalances;

    event TaskCreated(uint256 indexed taskId, address indexed creator, uint256 budget);
    event TaskStatusUpdated(uint256 indexed taskId, TaskStatus status);
    event FundsDeposited(uint256 indexed taskId, uint256 amount);

    /**
     * @dev 创建新任务并托管资金
     */
    function createTask(
        string memory _title,
        string memory _description
    ) external payable returns (uint256) {
        require(msg.value > 0, "Budget must be greater than 0");

        taskCounter++;
        uint256 taskId = taskCounter;

        tasks[taskId] = Task({
            id: taskId,
            creator: msg.sender,
            title: _title,
            description: _description,
            budget: msg.value,
            status: TaskStatus.Pending,
            createdAt: block.timestamp
        });

        taskBalances[taskId] = msg.value;

        emit TaskCreated(taskId, msg.sender, msg.value);
        emit FundsDeposited(taskId, msg.value);

        return taskId;
    }

    /**
     * @dev 更新任务状态
     */
    function updateTaskStatus(uint256 _taskId, TaskStatus _status) external {
        Task storage task = tasks[_taskId];
        require(task.creator == msg.sender, "Only creator can update status");
        require(task.status != TaskStatus.Completed, "Task already completed");
        require(task.status != TaskStatus.Cancelled, "Task already cancelled");

        task.status = _status;
        emit TaskStatusUpdated(_taskId, _status);
    }

    /**
     * @dev 获取任务信息
     */
    function getTask(uint256 _taskId) external view returns (Task memory) {
        return tasks[_taskId];
    }

    /**
     * @dev 获取任务余额
     */
    function getTaskBalance(uint256 _taskId) external view returns (uint256) {
        return taskBalances[_taskId];
    }
}
