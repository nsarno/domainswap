// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DomainSwap is Ownable {

    address public buyer;

    // Owner data
    string public ownerEmail;
    string public domain;
    uint public price;
    uint public insurance;

    // Buyer data
    string public buyerEmail;
    uint public buyerFunds;

    function initiateSale(string memory _ownerEmail, string memory _domain, uint _price) public onlyOwner payable {
        ownerEmail = _ownerEmail;
        domain = _domain;
        price = _price;
        insurance = msg.value;
    }

    // Let the buyer fund the escrow
    function fund(string memory _buyerEmail) public payable {
        require(equal(buyerEmail, ""), "A sale is already in progress");
        require(equal(_buyerEmail, "") == false, "Buyer email cannot be empty");
        require(msg.value >= price + insurance, "Funds must be greater or equal to the sum of the price and the insurance");

        buyerEmail = _buyerEmail;
        buyerFunds = msg.value;
    }

    // Let the seller confirm the domain transfer was initiated
    // function confirmDomainTransferInitiated() public onlyOwner {}

    // Let the buyer confirm the domain transfer was finalized
    function confirmDomainTransferFinalized() public {
        require(address(this) == buyer);
    }

    function equal(string memory a, string memory b) internal pure returns(bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}
