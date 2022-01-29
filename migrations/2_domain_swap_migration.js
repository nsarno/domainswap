const DomainSwap = artifacts.require("DomainSwap");

module.exports = function (deployer) {
  deployer.deploy(DomainSwap);
};
