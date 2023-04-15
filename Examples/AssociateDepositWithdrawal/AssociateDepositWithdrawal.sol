// SPDX-License-Identifier: MIT

//This contract is used to associate a token with the contract and deposit and withdraw tokens from the contract
// only depositer can withdraw the tokens    


pragma solidity ^0.8.0;

import "../../Hedera/SafeHTS.sol";

contract AssociateDepositWithdrawal {
    mapping(address => mapping(address => int64)) private _deposits;


    function associateToken(address tokenAddr) external {
       SafeHTS.safeAssociateToken(tokenAddr, address(this));
    } 
    
    function depositToken(address token, int64 amount) external {
        require(amount > 0, "Deposit amount should be greater than 0");
       SafeHTS.safeTransferToken(token, msg.sender, address(this), amount);
        _deposits[msg.sender][token] += amount;
    }

    function withdrawToken(address token, int64 amount) external {
        require(_deposits[msg.sender][token] >= amount, "Insufficient balance");
        require(amount > 0, "Withdrawal amount should be greater than 0");
        _deposits[msg.sender][token] -= amount;
       SafeHTS.safeTransferToken(token, address(this), msg.sender, amount);
    }

    function getDepositedAmount(address token) external view returns (int64) {
        return _deposits[msg.sender][token];
    }
}