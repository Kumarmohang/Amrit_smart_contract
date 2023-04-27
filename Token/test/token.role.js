const { expect } = require("chai");

const {
  BN,
  expectEvent,
  expectRevert,
  constants,
} = require("@openzeppelin/test-helpers");

const { ZERO_ADDRESS } = constants;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function checkIfIsAdmin(errorPrefix, from, anotherAccount, isAdmin) {
  describe("check if address is an admin", function () {
    it("return true", async function () {
      await this.token.addAdmin(anotherAccount);
      expect(await isAdmin.call(this, from, anotherAccount)).to.be.equal(true);
    });
  });
  describe("check if address is not an admin", function () {
    it("return false", async function () {
      expect(await isAdmin.call(this, from, anotherAccount)).to.be.equal(false);
    });
  });
  describe("check if address is ZERO_ADDRESS", function () {
    it("revert", async function () {
      await expectRevert(
        isAdmin.call(this, from, ZERO_ADDRESS),
        `Roles: account is the zero address`
      );
    });
  });
}

function checkIfAddAdmin(errorPrefix, from, to, anotherAccount, addAdmin) {
  describe("add account to admin", function () {
    it("return", async function () {
      const { logs } = await addAdmin.call(this, from, to);
      expect(await this.token.isAdmin(to)).to.be.equal(true);
    });
    it("emitEvent", async function () {
      const { logs } = await addAdmin.call(this, from, to);
      expectEvent.inLogs(logs, "AdminAdded", {
        account: to,
      });
    });
  });
  describe("add already added account to admin", function () {
    it("revert", async function () {
      await expectRevert(addAdmin.call(this, from, from), "cc");
    });
  });
  describe("add zero-address as a admin", function () {
    it("revert", async function () {
      await expectRevert(addAdmin.call(this, from, ZERO_ADDRESS), "cc");
    });
  });
  describe("if caller is not owner", function () {
    it("revert", async function () {
      await expectRevert(
        addAdmin.call(this, anotherAccount, to),
        "Ownable: caller is not the owner"
      );
    });
  });
  describe("add removed admin account as a admin", function () {
    it("return", async function () {
      await addAdmin.call(this, from, to);
      await this.token.removeAdmin(to);
      expect(await this.token.isAdmin(to)).to.be.equal(false);
      const { logs } = await addAdmin.call(this, from, to);
      expect(await this.token.isAdmin(to)).to.be.equal(true);
    });
    it("emitEvent", async function () {
      await addAdmin.call(this, from, to);
      await this.token.removeAdmin(to);
      expect(await this.token.isAdmin(to)).to.be.equal(false);
      const { logs } = await addAdmin.call(this, from, to);
      expectEvent.inLogs(logs, "AdminAdded", {
        account: to,
      });
    });
  });
}

function checkIfRemoveAdmin(
  errorPrefix,
  from,
  to,
  anotherAccount,
  removeAdmin
) {
  describe("remove admin account", function () {
    it("return", async function () {
      await this.token.addAdmin(to);
      expect(await this.token.isAdmin(to)).to.be.equal(true);
      const { logs } = await removeAdmin.call(this, from, to);
      expect(await this.token.isAdmin(to)).to.be.equal(false);
    });
    it("emitEvent", async function () {
      await this.token.addAdmin(to);
      expect(await this.token.isAdmin(to)).to.be.equal(true);
      const { logs } = await removeAdmin.call(this, from, to);
      expectEvent.inLogs(logs, "AdminRemoved", {
        account: to,
      });
    });
  });
  describe("remove non existing account to admin", function () {
    it("revert", async function () {
      await expectRevert(removeAdmin.call(this, from, to), "cc");
    });
  });
  describe("remove zero address account to admin", function () {
    it("revert", async function () {
      await expectRevert(removeAdmin.call(this, from, ZERO_ADDRESS), "cc");
    });
  });
  describe("if caller is not owner", function () {
    it("revert", async function () {
      await expectRevert(
        removeAdmin.call(this, anotherAccount, to),
        "Ownable: caller is not the owner"
      );
    });
  });
}

module.exports = {
  checkIfIsAdmin,
  checkIfAddAdmin,
  checkIfRemoveAdmin,
};
