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

  describe("Deposit", function () {
    it("Should pass with revertedWith, when attempted to deposit with amount equal 0", async function () {
      const { saveERC20 } = await loadFixture(deployContractsInstances);
      const tx = saveERC20.deposit(0);
      await expect(tx).to.be.revertedWith("can't save zero value");
    });

    it("Should pass with revertedWithCustomError from KOVACToken, when attempted to deposit without approval to spend token or having token type", async function () {
      const { saveERC20 } = await loadFixture(deployContractsInstances);
      const tx = saveERC20.deposit(100);
      //  ERC20InsufficientAllowance
      expect(tx).to.be.revertedWithCustomError;
    });

    it("Should pass an emit after successful transaction", async function () {
      const { saveERC20, token } = await loadFixture(deployContractsInstances);
      await token.approve(saveERC20.target, 100);
      console.log(saveERC20.target);

      const tx = saveERC20.deposit(100);

      expect(tx).to.emit;
    });

    it("Should increase contract's balance on safe deposit", async function () {
      const { saveERC20, token } = await loadFixture(deployContractsInstances);
      await token.approve(saveERC20.target, 100);
      await saveERC20.deposit(50);
      const bal = await saveERC20.checkContractBalance();
      expect(bal).to.equal(50);
    });

    it("Should pass with revertedWithCustomError, when attempted to deposit with amount greater than users owned token", async function () {
      const { saveERC20, token, owner } = await loadFixture(
        deployContractsInstances
      );
      await token.approve(saveERC20.target, 100);
      const tx = saveERC20.deposit(1000);
      expect(tx).to.be.revertedWithCustomError;
    });
  });

  describe("Withdraw", function () {
    it("Should pass with rejected, when attempted to withdraw amount equal 0", async function () {
      const { saveERC20, token } = await loadFixture(deployContractsInstances);
      await token.approve(saveERC20.target, 100);
      await saveERC20.deposit(100);
      const tx = saveERC20.withdraw(0);
      await expect(tx).to.be.rejectedWith("can't withdraw zero value");
    });

    it("Should pass with rejected, when attempted to withdraw amount above what was deposited", async function () {
      const { saveERC20, token } = await loadFixture(deployContractsInstances);
      await token.approve(saveERC20.target, 100);
      await saveERC20.deposit(100);
      const tx = saveERC20.withdraw(200);
      await expect(tx).to.be.revertedWith("insufficient funds");
    });
    it("Should return valid amount remaining as user's balance after withdrawal", async function () {
      const { saveERC20, token, owner } = await loadFixture(
        deployContractsInstances
      );
      await token.approve(saveERC20.target, 100);
      await saveERC20.deposit(100);
      await saveERC20.withdraw(50);
      const finalBal = await saveERC20.checkUserBalance(owner);
      expect(finalBal).to.equal(50);
    });
    it("Should emit after successful withdrawal", async function () {
      const { saveERC20, token } = await loadFixture(deployContractsInstances);
      await token.approve(saveERC20.target, 200);
      await saveERC20.deposit(100);
      const tx = await saveERC20.withdraw(20);
      expect(tx).to.emit;
    });
  });
});
