const DomainSwap = artifacts.require("DomainSwap")

contract("DomainSwap", (accounts) => {
  beforeEach(async () => {
    instance = await DomainSwap.new()
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
    const sellerBalance = web3.utils.toWei("0.2", "ether")
    const buyerBalance = web3.utils.toWei("0.1", "ether")

    await instance.fundEscrow(buyerEmail, {from: accounts[1], value: buyerFunds})

    assert.equal(buyerEmail, await instance.buyerEmail(), "The buyer email should be set")
    assert.equal(await instance.sellerBalance(), sellerBalance, "The seller balance should be 0.2 ether")
    assert.equal(await instance.buyerBalance(), buyerBalance, "The buyer balance should be 0.1 ether")
  })

  it("lets the buyer finalize the sale", async () => {
    const email = "owner@example.com"
    const domain = "example.org"
    const price = web3.utils.toWei("0.1", "ether")
    const insurance = web3.utils.toWei("0.1", "ether")

    await instance.initiateSale(email, domain, price, {from: accounts[0], value: insurance})

    const buyerEmail = "buyer@example.com"
    const buyerFunds = web3.utils.toWei("0.2", "ether")
    const sellerBalance = web3.utils.toWei("0.2", "ether")
    const buyerBalance = web3.utils.toWei("0.1", "ether")

    await instance.fundEscrow(buyerEmail, {from: accounts[1], value: buyerFunds})

    assert.equal(await instance.finalized(), false, "The sale should not be finalized yet")

    await instance.finalizeSale({from: accounts[1]})

    assert.equal(await instance.finalized(), true, "The sale should be finalized")
  })

  it("lets the seller withdraw the seller balance", async () => {
    const email = "owner@example.com"
    const domain = "example.org"
    const price = web3.utils.toWei("0.1", "ether")
    const insurance = web3.utils.toWei("0.1", "ether")

    await instance.initiateSale(email, domain, price, {from: accounts[0], value: insurance})

    const buyerEmail = "buyer@example.com"
    const buyerFunds = web3.utils.toWei("0.2", "ether")
    const sellerBalance = web3.utils.toWei("0.2", "ether")
    const buyerBalance = web3.utils.toWei("0.1", "ether")

    await instance.fundEscrow(buyerEmail, {from: accounts[1], value: buyerFunds})
    await instance.finalizeSale({from: accounts[1]})

    assert.equal(await instance.sellerBalance(), sellerBalance, "The seller balance should be 0.2 ether")

    await instance.withdrawSellerBalance({from: accounts[0]})

    assert.equal(await instance.sellerBalance(), 0, "The seller balance should be 0")
  })

  it("lets the buyer withdraw the buyer balance", async () => {
    const email = "owner@example.com"
    const domain = "example.org"
    const price = web3.utils.toWei("0.1", "ether")
    const insurance = web3.utils.toWei("0.1", "ether")

    await instance.initiateSale(email, domain, price, {from: accounts[0], value: insurance})

    const buyerEmail = "buyer@example.com"
    const buyerFunds = web3.utils.toWei("0.2", "ether")
    const sellerBalance = web3.utils.toWei("0.2", "ether")
    const buyerBalance = web3.utils.toWei("0.1", "ether")

    await instance.fundEscrow(buyerEmail, {from: accounts[1], value: buyerFunds})
    await instance.finalizeSale({from: accounts[1]})

    assert.equal(await instance.buyerBalance(), buyerBalance, "The buyer balance should be 0.1 ether")

    await instance.withdrawBuyerBalance({from: accounts[1]})

    assert.equal(await instance.buyerBalance(), 0, "The buyer balance should be 0")
  })
})
