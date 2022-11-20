// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

interface ProposerRegistry {
    function isProposer(bytes32 proposalType, address proposer) external returns (bool);
}

contract VotableProxyAdmin {
    uint256 public immutable defaultThreshold;

    mapping(bytes32 => Proposal) public proposals;
    address proposerRegistry;

    struct Proposal {
        uint256 threshold;
        uint256 approvals;
        uint256 turn;
        address target;
        bytes funcAndArgs;
    }

    error NotReachThreshold();
    error WrongTurn();
    error ProposalFailed(bytes msg);
    error NotSupportProposal();
    error OnlyByProposal();
    error NotProposer();

    event ProposalCompleted(bytes32 indexed proposalType, uint256 indexed turn, address target, bytes funcAndArgs);
    event ThresholdUpdated(bytes32 indexed proposalType, uint256 fromThreshold, uint256 toThreshold);

    constructor(uint256 _defaultThreshold, address _proposerRegistry) {
        defaultThreshold = _defaultThreshold;
        proposerRegistry = _proposerRegistry;
    }

    function setThreshold(address _target, bytes calldata _funcAndArgs, uint256 _threshold) public {
        if (msg.sender != address(this)) {
            revert OnlyByProposal();
        }
        bytes32 tmpProposalType = proposalType(_target, _funcAndArgs);
        emit ThresholdUpdated(tmpProposalType, proposals[tmpProposalType].threshold, _threshold);
        proposals[tmpProposalType].threshold = _threshold;
    }

    function proposalType(address _target, bytes calldata _funcAndArgs) public pure returns (bytes32) {
        return keccak256(abi.encode(_target, _funcAndArgs));
    }

    function propose(uint256 _turn, address _target, bytes calldata _funcAndArgs) external {
        address proposer = msg.sender;
        bytes32 tmpProposalType = proposalType(_target, _funcAndArgs);
        if (!ProposerRegistry(proposerRegistry).isProposer(tmpProposalType, proposer)) {
            revert NotProposer();
        }

        Proposal storage proposal = proposals[tmpProposalType];

        if (_turn != proposal.turn) {
            revert WrongTurn();
        }

        if (proposal.target == address(0)) {
            proposal.target = _target;
            proposal.funcAndArgs = _funcAndArgs;
        }

        uint256 threshold = proposal.threshold;
        if (threshold == 0) {
            threshold = defaultThreshold;
        }

        if (proposal.approvals < threshold) {
            proposal.approvals = proposal.approvals + 1;
        }

        if (proposal.approvals == threshold) {
            (bool status, bytes memory ret) = _target.call(_funcAndArgs);
            if (!status) {
                revert ProposalFailed(ret);
            }

            if (ret.length > 0) {
                revert NotSupportProposal();
            }

            proposal.turn = proposal.turn + 1;
            proposal.approvals = 0;
        }
    }
}
