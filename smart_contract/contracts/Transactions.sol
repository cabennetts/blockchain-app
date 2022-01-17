// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

/**
* @title Transactions
* @dev Allows user to send transactions from one wallet to another
*/
contract Transactions {
    // simple number variable that will hold number of transactions
    uint256 transactionCount;

    // Think of like a function that will be called (or emmited) later on
    event Transfer(address from, address receuver, uint amount, string message, uint256 timestamp, string keyword);

    // Structure (similar to an object) *NOT DECLARING AN OBJECT, JUST SPECIFYING WHAT PROPERTIES THE OJECT HAS AND OF WHAT TYPE*
    struct TransferStruct {
        address sender; //wallet sending ETH
        address receiver; //wallet receiving ETH
        uint amount; // amount being sent
        string message; // message being sent to receiver
        uint256 timestamp; // time of transaction
        string keyword; // keyword used for adding a GIF to transaction
    }
    // Transactions variable is going to be an array of TransferStruct
    TransferStruct[] transactions;

    /**
    * @dev emits the transfer to blockchain
    * @param receiver, amount, message, timestamp, keyword
    */
    function addToBlockchain( address payable receiver, uint amount, string memory message, string memory keyword)  public{
        // MAIN PART OF SMART CONTRACT
        transactionCount += 1;
        // adding transaction to list of all transactions *NOT ACTUALLY MAKING TRANSFER*
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));
        // emmiting the Transfer, transfers the amount 
        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    /**
    * @dev returns all transactions stored as an array
    *  
    */
    function getAllTransactions()  public view returns (TransferStruct[] memory){
        //return transactions as an array
        return transactions;
    }
    
    /**
    *@dev returns total number of transactions 
    */
    function getTransactionCount()  public view returns(uint256) {
        // return transaction count'
        return transactionCount;
    }
}