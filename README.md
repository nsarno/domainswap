# DomainSwap

## Summary

DomainSwap is a smart contract to enable domain transfers via a decentralized escrow.

## Contract Specifications

### `initiateSale`

Lets the owner / seller initiate the sale with a transaction.

- `ownerEmail`: the email of the owner for contact with buyers. 
- `domain`: the domain for sale.
- `price`: the sale price of the domain in Wei.
- `value`: the insurance price in Wei (the value of the transaction).

### `fundEscrow`

Lets a buyer add funds to purchase the domain. The funds must be at least the sum of the price and the insurance.

- `buyerEmail`: the email of the buyer for contact with the seller.
- `value`: the funds in Wei (the value of the transaction).

### `finalizeSale`

Lets the buyer successfully finalize the sale, which allows the balances to be withdrawn by the respective owner.

### `withdrawSellerBalance`

Lets the owner/seller withdraw their balance.

### `withdrawBuyerBalance`

Lets the buyer withdraw their balance.
