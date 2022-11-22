pragma solidity ^0.8.15;
// SPDX-License-Identifier: MIT

contract MockProposerRegistry {
    mapping(bytes32 => mapping(address => bool)) public proposers;

    function isProposer(bytes32 calldata proposalType, address proposer) external returns (bool){
        return proposers[proposalType][proposer];
    }

    function grantProposer(byte32 calldata proposalType, address proposer) external {
        proposer[proposalType][proposer] = true;
    }
}
