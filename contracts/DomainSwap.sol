// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DomainSwap is Ownable, ReentrancyGuard {

    // Sale data
    bool public finalized = false;

    // Owner data
    string public ownerEmail;
    string public domain;
    uint public price;
    uint public insurance;
    uint public sellerBalance = 0;

    // Buyer data
    address payable public buyer;
    string public buyerEmail;
    uint public buyerBalance = 0;

    // Let the owner/seller initiate the sale and pay the insurance
    function initiateSale(string memory _ownerEmail, string memory _domain, uint _price) public payable onlyOwner {
        require(address(0) == buyer, "A sale is already in progress");

        ownerEmail = _ownerEmail;
        domain = _domain;
        price = _price;
        insurance = msg.value;
        sellerBalance += insurance;
    }

    // Let the buyer fund the escrow
    function fundEscrow(string memory _buyerEmail) public payable nonReentrant {
        require(address(0) == buyer, "A sale is already in progress");
        require(msg.value >= price + insurance, "Funds must be greater or equal to the sum of the price and the insurance");

        buyer = payable(msg.sender);
        buyerEmail = _buyerEmail;
        sellerBalance += price;
        buyerBalance += insurance;
    }

    // Let the buyer finalize the sale.
    // - Transfer price + insurance to the seller
    // - Transfer insurance to buyer
    function finalizeSale() public {
        require(finalized == false, "Sale is already finalized");
        require(msg.sender == buyer, "Only the buyer can finalize the sale");

        finalized = true;
    }

    function withdrawSellerBalance() public payable nonReentrant onlyOwner {
        require(finalized == true, "Sale must be finalized");

        address payable seller = payable(owner());

        seller.transfer(sellerBalance);
        sellerBalance = 0;
    }

    function withdrawBuyerBalance() public payable nonReentrant {
        require(finalized == true, "Sale must be finalized");
        require(msg.sender == buyer, "Only the buyer can withdraw the buyer balance");

        buyer.transfer(buyerBalance);
        buyerBalance = 0;
    }
}
