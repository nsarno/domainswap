const DomainSwap = artifacts.require("DomainSwap")

contract("DomainSwap", (accounts) => {
  before(async () => {
    instance = await DomainSwap.deployed()
  })

  it("lets the owner initiate the sale", async () => {
    const email = "owner@example.com"
    const domain = "example.org"
    const price = web3.utils.toWei("0.1", "ether")
    const insurance = web3.utils.toWei("0.1", "ether")

    await instance.initiateSale(email, domain, price, {from: accounts[0], value: insurance})

    assert.equal(email, await instance.ownerEmail(), "The owner email should be set")
    assert.equal(domain, await instance.domain(), "The domain should be set")
    assert.equal(price, await instance.price(), "The price should be set")
    assert.equal(insurance, await instance.insurance(), "The insurance should be set")
  })

  it("lets the buyer add funds", async () => {
    const email = "owner@example.com"
    const domain = "example.org"
    const price = web3.utils.toWei("0.1", "ether")
    const insurance = web3.utils.toWei("0.1", "ether")

    await instance.initiateSale(email, domain, price, {from: accounts[0], value: insurance})

    const buyerEmail = "buyer@example.com"
    const buyerFunds = web3.utils.toWei("0.2", "ether")

    await instance.fund(buyerEmail, {from: accounts[1], value: buyerFunds})

    assert.equal(buyerEmail, await instance.buyerEmail(), "The buyer email should be set")
    assert.equal(buyerFunds, await instance.buyerFunds(), "The domain should be set")
  })
})