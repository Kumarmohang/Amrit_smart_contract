// test/Token.test.js
// SPDX-License-Identifier: MIT

// Based on https://github.com/OpenZeppelin/openzeppelin-solidity/blob/v2.5.1/test/examples/Token.test.js

const { expect } = require("chai");

//var chai = require("chai");

// Import utilities from Test Helpers
const {
  BN,
  expectEvent,
  expectRevert,
  constants,
} = require("@openzeppelin/test-helpers");

const {
  shouldBehaveLikeERC20,
  shouldBehaveLikeERC20Transfer,
  shouldBehaveLikeERC20Approve,
} = require("./token.behavior");

const {
  shouldBehaveLikeTransferWithHold,
  checkBeforeTokenTransfer,
  shouldBehaveLikeReleaseHold,
  shouldBehaveLikeRevoke,
  checkGetHoldBalance,
} = require("./token.hold");

const {
  checkIfIsAdmin,
  checkIfAddAdmin,
  checkIfRemoveAdmin,
} = require("./token.role");

const { ZERO_ADDRESS } = constants;

// Load compiled artifacts
const Token = artifacts.require("Token");

// Start test block
contract("Token", function (accounts) {
  const [initialHolder, recipient, anotherAccount] = accounts;
  const NAME = "Token";
  const SYMBOL = "SIM";
  const TOTAL_SUPPLY = new BN("10000000000000000000000");
  const initialSupply = TOTAL_SUPPLY;
  let tokenTest = null;

  beforeEach(async function () {
    this.token = await Token.new(
      NAME,
      SYMBOL,
      TOTAL_SUPPLY,
      initialHolder,
      initialHolder
    );
    // tokenTest = this.token
  });

  it("retrieve returns a value previously stored", async function () {
    // Use large integer comparisons
    expect(await this.token.totalSupply()).to.be.bignumber.equal(TOTAL_SUPPLY);
  });

  it("has a name", async function () {
    expect(await this.token.name()).to.be.equal(NAME);
  });

  it("has a symbol", async function () {
    expect(await this.token.symbol()).to.be.equal(SYMBOL);
  });

  it("assigns the initial total supply to the creator", async function () {
    expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(
      TOTAL_SUPPLY
    );
  });

  it("has 18 decimals", async function () {
    expect(await this.token.decimals()).to.be.bignumber.equal("18");
  });

  shouldBehaveLikeERC20(
    "ERC20",
    TOTAL_SUPPLY,
    initialHolder,
    recipient,
    anotherAccount
  );
  describe("decrease allowance", function () {
    describe("when the spender is not the zero address", function () {
      const spender = recipient;

      function shouldDecreaseApproval(amount) {
        describe("when there was no approved amount before", function () {
          it("reverts", async function () {
            await expectRevert(
              this.token.decreaseAllowance(spender, amount, {
                from: initialHolder,
              }),
              "ERC20: decreased allowance below zero"
            );
          });
        });

        describe("when the spender had an approved amount", function () {
          const approvedAmount = amount;

          beforeEach(async function () {
            ({ logs: this.logs } = await this.token.approve(
              spender,
              approvedAmount,
              { from: initialHolder }
            ));
          });

          it("emits an approval event", async function () {
            const { logs } = await this.token.decreaseAllowance(
              spender,
              approvedAmount,
              { from: initialHolder }
            );

            expectEvent.inLogs(logs, "Approval", {
              owner: initialHolder,
              spender: spender,
              value: new BN(0),
            });
          });

          it("decreases the spender allowance subtracting the requested amount", async function () {
            await this.token.decreaseAllowance(
              spender,
              approvedAmount.subn(1),
              { from: initialHolder }
            );

            expect(
              await this.token.allowance(initialHolder, spender)
            ).to.be.bignumber.equal("1");
          });

          it("sets the allowance to zero when all allowance is removed", async function () {
            await this.token.decreaseAllowance(spender, approvedAmount, {
              from: initialHolder,
            });
            expect(
              await this.token.allowance(initialHolder, spender)
            ).to.be.bignumber.equal("0");
          });

          it("reverts when more than the full allowance is removed", async function () {
            await expectRevert(
              this.token.decreaseAllowance(spender, approvedAmount.addn(1), {
                from: initialHolder,
              }),
              "ERC20: decreased allowance below zero"
            );
          });
        });
      }

      describe("when the sender has enough balance", function () {
        const amount = initialSupply;

        shouldDecreaseApproval(amount);
      });

      describe("when the sender does not have enough balance", function () {
        const amount = initialSupply.addn(1);

        shouldDecreaseApproval(amount);
      });
    });

    describe("when the spender is the zero address", function () {
      const amount = initialSupply;
      const spender = ZERO_ADDRESS;

      it("reverts", async function () {
        await expectRevert(
          this.token.decreaseAllowance(spender, amount, {
            from: initialHolder,
          }),
          "ERC20: decreased allowance below zero"
        );
      });
    });
  });
  describe("increase allowance", function () {
    const amount = initialSupply;

    describe("when the spender is not the zero address", function () {
      const spender = recipient;

      describe("when the sender has enough balance", function () {
        it("emits an approval event", async function () {
          const { logs } = await this.token.increaseAllowance(spender, amount, {
            from: initialHolder,
          });

          expectEvent.inLogs(logs, "Approval", {
            owner: initialHolder,
            spender: spender,
            value: amount,
          });
        });

        describe("when there was no approved amount before", function () {
          it("approves the requested amount", async function () {
            await this.token.increaseAllowance(spender, amount, {
              from: initialHolder,
            });

            expect(
              await this.token.allowance(initialHolder, spender)
            ).to.be.bignumber.equal(amount);
          });
        });

        describe("when the spender had an approved amount", function () {
          beforeEach(async function () {
            await this.token.approve(spender, new BN(1), {
              from: initialHolder,
            });
          });

          it("increases the spender allowance adding the requested amount", async function () {
            await this.token.increaseAllowance(spender, amount, {
              from: initialHolder,
            });

            expect(
              await this.token.allowance(initialHolder, spender)
            ).to.be.bignumber.equal(amount.addn(1));
          });
        });
      });

      describe("when the sender does not have enough balance", function () {
        const amount = initialSupply.addn(1);

        it("emits an approval event", async function () {
          const { logs } = await this.token.increaseAllowance(spender, amount, {
            from: initialHolder,
          });

          expectEvent.inLogs(logs, "Approval", {
            owner: initialHolder,
            spender: spender,
            value: amount,
          });
        });

        describe("when there was no approved amount before", function () {
          it("approves the requested amount", async function () {
            await this.token.increaseAllowance(spender, amount, {
              from: initialHolder,
            });

            expect(
              await this.token.allowance(initialHolder, spender)
            ).to.be.bignumber.equal(amount);
          });
        });

        describe("when the spender had an approved amount", function () {
          beforeEach(async function () {
            await this.token.approve(spender, new BN(1), {
              from: initialHolder,
            });
          });

          it("increases the spender allowance adding the requested amount", async function () {
            await this.token.increaseAllowance(spender, amount, {
              from: initialHolder,
            });

            expect(
              await this.token.allowance(initialHolder, spender)
            ).to.be.bignumber.equal(amount.addn(1));
          });
        });
      });
    });

    describe("when the spender is the zero address", function () {
      const spender = ZERO_ADDRESS;

      it("reverts", async function () {
        await expectRevert(
          this.token.increaseAllowance(spender, amount, {
            from: initialHolder,
          }),
          "ERC20: approve to the zero address"
        );
      });
    });
  });

  describe("_transfer", function () {
    shouldBehaveLikeERC20Transfer(
      "ERC20",
      initialHolder,
      recipient,
      initialSupply,
      function (from, to, amount) {
        return this.token.transfer(to, amount);
      }
    );
  });

  describe("_approve", function () {
    shouldBehaveLikeERC20Approve(
      "ERC20",
      initialHolder,
      recipient,
      initialSupply,
      function (owner, spender, amount) {
        return this.token.approve(spender, amount);
      }
    );
  });

  describe("transferWithHold", function () {
    console.log(this.token, "contract adress is printed............");
    shouldBehaveLikeTransferWithHold(
      "ERC20",
      initialHolder,
      recipient,
      initialSupply,
      function (from, to, amount, date) {
        return this.token.transferWithHold(to, amount, date, { from: from });
      }
    );
  });

  describe("_beforeTokenTransfer", function () {
    checkBeforeTokenTransfer(
      "ERC20",
      initialHolder,
      recipient,
      initialSupply,
      function (from, to, amount) {
        return this.token.transfer(to, amount, { from: from });
      },
      function (owner, spender, amount) {
        return this.token.approve(spender, amount);
      }
    );
  });

  // describe("releaseHold", function () {
  //   shouldBehaveLikeReleaseHold(
  //     "ERC20",
  //     initialHolder,
  //     recipient,
  //     initialSupply,
  //     anotherAccount,
  //     function (from, to) {
  //       return this.token.releaseHold(to, { from: from });
  //     }
  //   );
  // });
  // describe("revoke", function () {
  //   shouldBehaveLikeRevoke(
  //     "ERC20",
  //     initialHolder,
  //     recipient,
  //     initialSupply,
  //     anotherAccount,
  //     function (from, to) {
  //       return this.token.revoke(to, { from: from });
  //     }
  //   );
  // });
  describe("getHoldBalance", function () {
    checkGetHoldBalance(
      "ERC20",
      initialHolder,
      recipient,
      initialSupply,
      function (to) {
        return this.token.getHoldBalance(to);
      }
    );
  });

  describe("isAdmin", function () {
    checkIfIsAdmin(
      "ERC20",
      initialHolder,
      anotherAccount,
      function (from, checkAddr) {
        return this.token.isAdmin(checkAddr, { from: from });
      }
    );
  });
  describe("addAdmin", function () {
    checkIfAddAdmin(
      "ERC20",
      initialHolder,
      recipient,
      anotherAccount,
      function (from, addAddr) {
        return this.token.addAdmin(addAddr, { from: from });
      }
    );
  });
  describe("removeAdmin", function () {
    checkIfRemoveAdmin(
      "ERC20",
      initialHolder,
      recipient,
      anotherAccount,
      function (from, remAddr) {
        return this.token.removeAdmin(remAddr, { from: from });
      }
    );
  });
});
