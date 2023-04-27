const { expect } = require("chai");

const {
  BN,
  expectEvent,
  expectRevert,
  constants,
} = require("@openzeppelin/test-helpers");

const { ZERO_ADDRESS } = constants;

const getTimeValue = () => {
  return parseInt(new Date().getTime() / 1000);
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldBehaveLikeTransferWithHold(
  errorPrefix,
  from,
  to,
  balance,
  transferWithHold
) {
  //caller is not owner
  describe("when the caller is the not a owner", function () {
    it("reverts", async function () {
      const amount = balance;
      await expectRevert(
        transferWithHold.call(this, to, to, amount, getTimeValue() + 10000),
        `AdminRole: caller is not the Admin.`
      );
    });
  });
  describe("when the lock time is earlier than start time", function () {
    it("reverts", async function () {
      await expectRevert(
        transferWithHold.call(this, from, to, balance, getTimeValue() - 50000),
        `endTime should not be earlier to start time.`
      );
    });
  });
  describe("when the recipient is the zero address", function () {
    it("reverts", async function () {
      await expectRevert(
        transferWithHold.call(
          this,
          from,
          ZERO_ADDRESS,
          balance,
          getTimeValue() + 10000
        ),
        `transferWithHold: transfer with zero address.`
      );
    });
  });
  describe("when the amount is zero", function () {
    it("reverts", async function () {
      await expectRevert(
        transferWithHold.call(this, from, to, 0, getTimeValue() + 10000),
        `transferWithHold: amount must be greater than zero.`
      );
    });
  });

  describe("when the sender transfers amount in hold to receipent", function () {
    const amount = balance;

    it("transfers the requested amount which will be on hold", async function () {
      await transferWithHold.call(
        this,
        from,
        to,
        amount,
        getTimeValue() + 10000
      );

      console.log(await this.token.balanceOf(from));
      expect(await this.token.balanceOf(from)).to.be.a.bignumber.equal(
        new BN("0")
      );

      expect(await this.token.balanceOf(to)).to.be.bignumber.equal(new BN("0"));

      expect(await this.token.getHoldBalance(to)).to.be.bignumber.equal(amount);
    });
    // console.log(tokenAddress.call(),"token address.......")
    it("emits a transfer event", async function () {
      const { logs } = await transferWithHold.call(
        this,
        from,
        to,
        amount,
        getTimeValue() + 10000
      );
      // expectEvent.inLogs(logs, "Transfer", {
      //   from,
      //   to,
      //   value: amount,
      // });
    });
  });

  describe("when the recipient is not the zero address", function () {
    describe("when the sender does not have enough balance", function () {
      const amount = balance.addn(1);

      it("reverts", async function () {
        await expectRevert(
          transferWithHold.call(this, from, to, amount, getTimeValue() + 10000),
          `${errorPrefix}: transfer amount exceeds balance`
        );
      });
    });
  });
}

function checkBeforeTokenTransfer(
  errorPrefix,
  from,
  to,
  balance,
  transfer,
  approve
) {
  describe("_beforeTokenTransfer internal function checking ", function () {
    const amount = new BN(balance);

    it("reverts transfer as amount is on hold", async function () {
      await this.token.transferWithHold(to, amount, getTimeValue() + 10000);
      await expectRevert(
        transfer.call(this, to, from, amount),
        "Not enough balance"
      );
    });

    it("transfer as amount is not on hold", async function () {
      const { logs } = await transfer.call(this, from, to, amount);
      expect(await this.token.balanceOf(to)).to.be.bignumber.equal(amount);
      expect(await this.token.balanceOf(from)).to.be.bignumber.equal("0");
      expectEvent.inLogs(logs, "Transfer", {
        from,
        to,
        value: amount,
      });
    });

    it("if hold time is expired then it should release the amount and transfer", async function () {
      const { logs } = await this.token.transferWithHold(
        to,
        amount,
        getTimeValue() + 2
      );
      await sleep(5000);
      // sample transaction
      await approve.call(this, to, from, amount);
      await transfer.call(this, to, from, amount);
      expect(await this.token.balanceOf(to)).to.be.bignumber.equal("0");
      expect(await this.token.balanceOf(from)).to.be.bignumber.equal(amount);
      // expectEvent.inLogs(logs, "Transfer", {
      //   to,
      //   from,
      //   value: amount,
      // });
    });
  });
}

function shouldBehaveLikeReleaseHold(
  errorPrefix,
  from,
  to,
  balance,
  anotherAccount,
  releaseHold
) {
  // caller is not owner
  describe("when the caller is the not a owner", function () {
    it("reverts", async function () {
      const amount = balance;
      await this.token.transferWithHold(to, amount, getTimeValue() + 10000);
      await expectRevert(
        releaseHold.call(this, anotherAccount, to),
        `Ownable: caller is not the owner.`
      );
    });
  });
  describe("when the recipient is the zero address", function () {
    it("reverts", async function () {
      await expectRevert(
        releaseHold.call(this, from, ZERO_ADDRESS),
        `releaseHold: releaseHold with zero address.`
      );
    });
  });
  describe("when the recipient has no hold tokens", function () {
    it("reverts", async function () {
      await expectRevert(
        releaseHold.call(this, from, to),
        `release: hold does not exist for the user.`
      );
    });
  });

  describe("when owner release the holded tokens for receipent", function () {
    const amount = balance;

    it("release holded tokens", async function () {
      await this.token.transferWithHold(to, amount, getTimeValue() + 10000);
      const { logs } = await releaseHold.call(this, from, to);

      expect(await this.token.balanceOf(to)).to.be.bignumber.equal(amount);

      expect(await this.token.getHoldBalance(to)).to.be.bignumber.equal("0");
    });

    // it("emits a transfer event", async function () {
    //   const { logs } = await transferWithHold.call(
    //     this,
    //     from,
    //     to,
    //     amount,
    //     getTimeValue() + 10000
    //   );

    //   expectEvent.inLogs(logs, "Transfer", {
    //     from,
    //     to,
    //     value: amount,
    //   });
    // });
  });
}

function checkGetHoldBalance(errorPrefix, from, to, balance, getHoldBalance) {
  describe("Get hold balance for holded account", function () {
    const amount = new BN(balance);
    it("return holded tokens", async function () {
      await this.token.transferWithHold(to, amount, getTimeValue() + 10000);
      expect(await getHoldBalance.call(this, to)).to.be.bignumber.equal(amount);
    });
  });
  describe("Get hold balance for normal (not holded) account", function () {
    it("revoke holded tokens", async function () {
      expect(await getHoldBalance.call(this, to)).to.be.bignumber.equal("0");
    });
  });
}

function shouldBehaveLikeRevoke(
  errorPrefix,
  from,
  to,
  balance,
  anotherAccount,
  revoke
) {
  describe("when the caller is the not a owner", function () {
    it("reverts", async function () {
      const amount = balance;
      await this.token.transferWithHold(to, amount, getTimeValue() + 10000);
      await expectRevert(
        revoke.call(this, anotherAccount, to, { from: anotherAccount }),
        `Ownable: caller is not the owner.`
      );
    });
  });

  // describe("when the recipient is the zero address", function () {
  //   it("reverts", async function () {
  //     await expectRevert(
  //       revoke.call(this, from, ZERO_ADDRESS),
  //       `revoke: revoke with zero address.`
  //     );
  //   });
  // });
  describe("when the recipient has no hold tokens", function () {
    it("reverts", async function () {
      await expectRevert(
        revoke.call(this, from, to),
        `revoke: hold does not exist for the user.`
      );
    });
  });

  describe("when owner revoke the holded tokens for receipent", function () {
    const amount = balance;

    it("revoke holded tokens", async function () {
      await this.token.transferWithHold(to, amount, getTimeValue() + 10000);
      console.log(to);
      const { logs } = await revoke.call(this, from, to);
      expect(await this.token.balanceOf(to)).to.be.bignumber.equal("0");

      expect(await this.token.getHoldBalance(to)).to.be.bignumber.equal("0");
    });

    it("emits a revoke event", async function () {
      await this.token.transferWithHold(to, amount, getTimeValue() + 10000);
      console.log(to);
      const { logs } = await revoke.call(this, from, to);

      expectEvent.inLogs(logs, "Revoke", {
        from: to,
        to: from,
        value: amount,
        message: "Locked tokens revoked by owner",
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeTransferWithHold,
  checkBeforeTokenTransfer,
  shouldBehaveLikeReleaseHold,
  shouldBehaveLikeRevoke,
  checkGetHoldBalance,
};
