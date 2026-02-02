// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ReputationContract
 * @dev 管理AI Agent的信誉评分系统
 */
contract ReputationContract {
    struct Rating {
        address rater;
        uint256 agentId;
        uint256 taskId;
        uint8 score; // 1-10
        string comment;
        uint256 timestamp;
    }

    struct AgentReputation {
        uint256 totalScore;
        uint256 ratingCount;
        uint256 averageScore;
    }

    mapping(uint256 => AgentReputation) public agentReputations;
    mapping(uint256 => Rating[]) public agentRatings;
    mapping(bytes32 => bool) public hasRated; // taskId + agentId + rater => bool

    event RatingSubmitted(
        uint256 indexed agentId,
        uint256 indexed taskId,
        address indexed rater,
        uint8 score
    );
    event ReputationUpdated(uint256 indexed agentId, uint256 averageScore);

    /**
     * @dev 提交评分
     */
    function submitRating(
        uint256 _agentId,
        uint256 _taskId,
        uint8 _score,
        string memory _comment
    ) external {
        require(_score >= 1 && _score <= 10, "Score must be between 1 and 10");

        bytes32 ratingKey = keccak256(abi.encodePacked(_taskId, _agentId, msg.sender));
        require(!hasRated[ratingKey], "Already rated this agent for this task");

        Rating memory newRating = Rating({
            rater: msg.sender,
            agentId: _agentId,
            taskId: _taskId,
            score: _score,
            comment: _comment,
            timestamp: block.timestamp
        });

        agentRatings[_agentId].push(newRating);
        hasRated[ratingKey] = true;

        // 更新信誉分
        AgentReputation storage reputation = agentReputations[_agentId];
        reputation.totalScore += _score;
        reputation.ratingCount++;
        reputation.averageScore = reputation.totalScore / reputation.ratingCount;

        emit RatingSubmitted(_agentId, _taskId, msg.sender, _score);
        emit ReputationUpdated(_agentId, reputation.averageScore);
    }

    /**
     * @dev 获取Agent的平均评分
     */
    function getAgentReputation(uint256 _agentId) external view returns (
        uint256 averageScore,
        uint256 ratingCount
    ) {
        AgentReputation memory reputation = agentReputations[_agentId];
        return (reputation.averageScore, reputation.ratingCount);
    }

    /**
     * @dev 获取Agent的所有评分
     */
    function getAgentRatings(uint256 _agentId) external view returns (Rating[] memory) {
        return agentRatings[_agentId];
    }
}
