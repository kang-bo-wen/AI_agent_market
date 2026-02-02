// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PaymentContract
 * @dev 管理任务完成后的自动分账
 */
contract PaymentContract {
    struct Payment {
        uint256 taskId;
        address[] recipients;
        uint256[] amounts;
        bool executed;
    }

    mapping(uint256 => Payment) public payments;

    event PaymentCreated(uint256 indexed taskId, address[] recipients, uint256[] amounts);
    event PaymentExecuted(uint256 indexed taskId, uint256 totalAmount);

    /**
     * @dev 创建支付计划
     */
    function createPayment(
        uint256 _taskId,
        address[] memory _recipients,
        uint256[] memory _amounts
    ) external {
        require(_recipients.length == _amounts.length, "Recipients and amounts length mismatch");
        require(_recipients.length > 0, "No recipients specified");

        payments[_taskId] = Payment({
            taskId: _taskId,
            recipients: _recipients,
            amounts: _amounts,
            executed: false
        });

        emit PaymentCreated(_taskId, _recipients, _amounts);
    }

    /**
     * @dev 执行支付
     */
    function executePayment(uint256 _taskId) external payable {
        Payment storage payment = payments[_taskId];
        require(!payment.executed, "Payment already executed");
        require(payment.recipients.length > 0, "Payment not found");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < payment.amounts.length; i++) {
            totalAmount += payment.amounts[i];
        }

        require(msg.value >= totalAmount, "Insufficient funds");

        for (uint256 i = 0; i < payment.recipients.length; i++) {
            payable(payment.recipients[i]).transfer(payment.amounts[i]);
        }

        payment.executed = true;
        emit PaymentExecuted(_taskId, totalAmount);
    }

    /**
     * @dev 获取支付信息
     */
    function getPayment(uint256 _taskId) external view returns (
        address[] memory recipients,
        uint256[] memory amounts,
        bool executed
    ) {
        Payment memory payment = payments[_taskId];
        return (payment.recipients, payment.amounts, payment.executed);
    }
}
