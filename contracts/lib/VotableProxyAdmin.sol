// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

contract VotableProxyAdmin {
    uint256 public immutable defaultThreshold;

    mapping(bytes32 => Proposal) public proposals;

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

    constructor(uint256 _threshold) {
        defaultThreshold = _threshold;
    }

    function setThreshold(address _target, bytes calldata _funcAndArgs, uint256 _threshold) public {
        if (msg.sender != address(this)) {
            revert OnlyByProposal();
        }
        bytes32 proposalType_ = proposalType(_target, _funcAndArgs);
        proposals[proposalType_].threshold = _threshold;
    }

    function proposalType(address _target, bytes calldata _funcAndArgs) public pure returns (bytes32){
        return keccak256(abi.encode(_target, _funcAndArgs));
    }

    function propose(uint256 _turn, address _target, bytes calldata _funcAndArgs) external {
        bytes32 proposalType_ = proposalType(_target, _funcAndArgs);
        Proposal storage proposal = proposals[proposalType_];

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

        if (proposal.approvals == defaultThreshold) {
            (bool status, bytes memory ret) = _target.call(_funcAndArgs);
            if (!status) {
                revert ProposalFailed(ret);
            }

            if (ret.length > 0) {
                revert NotSupportProposal();
            }

            proposal.turn = proposal.turn + 1;
        }
    }
}
