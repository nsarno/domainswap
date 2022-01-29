# Swap

## Summary

Swap is a smart contract to allow escrow transactions without third-party.

## Contract Specifications

### `initiateSale`

Lets the owner / seller initiate the sale with a transaction.

- `ownerEmail`: the email of the owner for contact with buyers. 
- `domain`: the domain for sale.
- `price`: the sale price of the domain in Wei.
- `value`: the insurance price in Wei (the value of the transaction).

### `fund`

Lets a buyer add funds to purchase the domain. The funds must be at least the sum of the price and the insurance.

- `buyerEmail`: the email of the buyer for contact with the seller.
- `value`: the funds in Wei (the value of the transaction).
