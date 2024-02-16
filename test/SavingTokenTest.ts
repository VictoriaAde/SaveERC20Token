import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Contract cases", function () {
  async function deployContractsInstances() {
    const [owner, otherAccount] = await ethers.getSigners();

    const KOVACToken = await ethers.getContractFactory("VickishToken");
    const token = await KOVACToken.deploy();

    const SaveERC20 = await ethers.getContractFactory("SaveERC20");
    const saveERC20 = await SaveERC20.deploy(token.target);

    return { token, saveERC20, owner, otherAccount };
  }

  describe("Contracts Deployments", function () {
    it("Should pass if VickishToken contract has deployed succesffully", async function () {
      const { token } = await loadFixture(deployContractsInstances);

      expect(token).to.exist;
    });
    it("Should pass if SaveERC20 contract has deployed succesffully", async function () {
      const { saveERC20 } = await loadFixture(deployContractsInstances);

      expect(saveERC20).to.exist;
    });
  });
});
