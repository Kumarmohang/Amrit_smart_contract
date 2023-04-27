import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Token", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  let tokenName = "Amrit";
  let tokenSymbol = "AMRT";
  let totalSupply = "1000000000000000000000000000";
  let TokenAddress: any;
  let userOne: any;
  let toaddress: any;
  let Owner: any;
  let signers: SignerWithAddress[];
  let otherAccount: any;
  let token: any;
  let zero = "0x0000000000000000000000000000000000000000";
  let maxInt: any = 2 ** 256 - 1;
  let test_address: any;

  beforeEach(async () => {
    signers = await ethers.getSigners();
    Owner = signers[0].address;
    userOne = signers[1].address;
    toaddress = signers[9].address;

    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(
      tokenName,
      tokenSymbol,
      totalSupply,
      Owner,
      Owner
    );
    await token.deployed();
    TokenAddress = token.address;
  });
  describe("Transfer()", () => {
    it("transfer should work from the owner account/address ", async () => {
      const from_balance = await token.balanceOf(Owner);
      const to_balalnce = await token.balanceOf(userOne);
      // console.log({ from_balance });
      // console.log({ to_balalnce });
      const transaction = await token.transfer(userOne, 100);
      const afterFrombalance = await token.balanceOf(Owner);
      const afterTobalance = await token.balanceOf(userOne);
      expect(afterFrombalance).to.equals(from_balance.sub(100));
      expect(afterTobalance).to.equals(to_balalnce.add(100));
      // console.log({ afterFrombalance });
      // console.log({ afterTobalance });
    });
  });
  describe("erc20-transferfrom-revert-to-zero()", () => {
    it("it should be reverted if the destination address is zero", async () => {
      const apprve = await token.approve(signers[1].address, 10000);
      const transaction = token
        .connect(signers[1])
        .transferFrom(Owner, zero, 10000);
      await expect(transaction).to.be.revertedWith(
        "ERC20: transfer to the zero address"
      );
    });
  });
  describe("erc20-transferfrom-succeed-normal()", () => {
    it("the transaction should be successfull", async () => {
      const value = 1000;
      const apprve = await token.approve(signers[1].address, value);
      const allowance = await token.allowance(Owner, signers[1].address);
      const tobalance = await token.balanceOf(toaddress);
      const fromBalance = await token.balanceOf(Owner);
      expect(signers[1].address).not.equals(zero);
      expect(toaddress).not.equals(zero);
      expect(signers[1].address).not.equals(Owner);
      expect(value).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      expect(value).to.be.greaterThanOrEqual(0);
      expect(tobalance).to.be.greaterThanOrEqual(0);
      expect(fromBalance).to.be.greaterThanOrEqual(0);
      expect(fromBalance).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      expect(allowance).to.be.greaterThanOrEqual(0);
      expect(allowance).to.lessThanOrEqual(ethers.constants.MaxUint256);
      const transaction = await token
        .connect(signers[1])
        .transferFrom(Owner, toaddress, value);
      //   const after_tobalance = await token.balanceOf(toaddress);
      // const after_fromBalance = await token.balanceOf(Owner);
      // expect(after_fromBalance).to.be.equal(fromBalance.sub(value));
      // expect(after_tobalance).to.be.equals(tobalance.add(value));
    });
  });

  describe("erc20-transferfrom-succeed-self()", () => {
    it("the transaction should be successfull from and to address is same", async () => {
      const value = 100;
      const apprve = await token.approve(signers[1].address, value);
      const allowance = await token.allowance(Owner, signers[1].address);
      const fromBalance = await token.balanceOf(Owner);
      expect(signers[1].address).not.equals(zero);
      expect(signers[1].address).not.equals(Owner);
      expect(value).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      expect(value).to.be.greaterThanOrEqual(0);
      expect(fromBalance).to.be.greaterThanOrEqual(0);
      expect(fromBalance).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      expect(allowance).to.be.greaterThanOrEqual(0);
      expect(allowance).to.lessThanOrEqual(ethers.constants.MaxUint256);
      const transaction = await token
        .connect(signers[1])
        .transferFrom(Owner, Owner, value);
      const after_fromBalance = await token.balanceOf(Owner);
      expect(after_fromBalance).to.be.equal(fromBalance);
    });
  });
  describe("erc20-transferfrom-correct-amount()", () => {
    it("the transaction should be successfull with proper amount or value", async () => {
      const value = 1000;
      const apprve = await token.approve(signers[1].address, value);
      const allowance = await token.allowance(Owner, signers[1].address);
      const tobalance = await token.balanceOf(toaddress);
      const fromBalance = await token.balanceOf(Owner);
      expect(signers[1].address).not.equals(zero);
      expect(toaddress).not.equals(zero);
      expect(signers[1].address).not.equals(Owner);
      expect(value).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      expect(value).to.be.greaterThanOrEqual(0);
      expect(tobalance).to.be.greaterThanOrEqual(0);
      expect(fromBalance).to.be.greaterThanOrEqual(0);
      expect(fromBalance).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      expect(allowance).to.be.greaterThanOrEqual(0);
      expect(allowance).to.lessThanOrEqual(ethers.constants.MaxUint256);
      const transaction = await token
        .connect(signers[1])
        .transferFrom(Owner, toaddress, value);
      const after_tobalance = await token.balanceOf(toaddress);
      const after_fromBalance = await token.balanceOf(Owner);
      expect(after_fromBalance).to.be.equal(fromBalance.sub(value));
      expect(after_tobalance).to.be.equals(tobalance.add(value));
    });
  });

  describe("erc20-transferfrom-correct-amount-self()", () => {
    it("the transaction should be successfull from and to address is same", async () => {
      const value = 100;
      const apprve = await token.approve(signers[1].address, value);
      const allowance = await token.allowance(Owner, signers[1].address);
      const fromBalance = await token.balanceOf(Owner);
      expect(signers[1].address).not.equals(zero);
      expect(signers[1].address).not.equals(Owner);
      expect(value).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      expect(value).to.be.greaterThanOrEqual(0);
      expect(fromBalance).to.be.greaterThanOrEqual(0);
      expect(fromBalance).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      expect(allowance).to.be.greaterThanOrEqual(0);
      expect(allowance).to.lessThanOrEqual(ethers.constants.MaxUint256);
      const transaction = await token
        .connect(signers[1])
        .transferFrom(Owner, Owner, value);
      const after_fromBalance = await token.balanceOf(Owner);
      expect(after_fromBalance).to.be.equal(fromBalance);
    });
  });
  describe("erc20-transferfrom-correct-allowance()", () => {
    it("the transaction should be successfull with proper amount or value", async () => {
      const value = 1000;
      const apprve = await token.approve(signers[1].address, 1000000);
      const allowance = await token.allowance(Owner, signers[1].address);
      expect(value).to.be.greaterThanOrEqual(0);
      const tobalance = await token.balanceOf(toaddress);
      const fromBalance = await token.balanceOf(Owner);
      expect(signers[1].address).not.equals(zero);
      expect(toaddress).not.equals(zero);
      expect(signers[1].address).not.equals(Owner);
      expect(value).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      expect(tobalance).to.be.greaterThanOrEqual(0);
      expect(fromBalance).to.be.greaterThanOrEqual(0);
      expect(fromBalance).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      expect(allowance).to.be.greaterThanOrEqual(0);
      expect(allowance).to.lessThanOrEqual(ethers.constants.MaxUint256);
      const transaction = await token
        .connect(signers[1])
        .transferFrom(Owner, toaddress, value);
      const after_tobalance = await token.balanceOf(toaddress);
      const after_fromBalance = await token.balanceOf(Owner);
      const after_allowance = await token.allowance(Owner, signers[1].address);
      expect(after_fromBalance).to.be.equal(fromBalance.sub(value));
      expect(after_tobalance).to.be.equals(tobalance.add(value));
      expect(after_allowance).to.be.equals(allowance.sub(value));
    });
  });

  describe("erc20-transferfrom-change-state()", () => {
    it("after Transferfrom call , other state variables should not change ", async () => {
      const value = 1000;
      let P1_address = signers[5].address;
      let P2_address = signers[6].address;
      let P3_address = signers[7].address;

      const apprve = await token.approve(signers[1].address, value);
      const allowance = await token.allowance(Owner, signers[1].address);
      expect(P1_address).to.not.equals(Owner);
      expect(P1_address).to.not.equals(toaddress);
      expect(P2_address).to.not.equals(Owner);
      expect(P3_address).to.not.equals(signers[0].address);
      const P1_p2_allowance = await token.allowance(P1_address, P2_address);
      const totalSupply = await token.totalSupply();
      const P1_balance = await token.balanceOf(P1_address);
      const transaction = await token
        .connect(signers[1])
        .transferFrom(Owner, toaddress, value);
      const after_P1_p2_allowance = await token.allowance(
        P1_address,
        P2_address
      );
      const after_totalSupply = await token.totalSupply();
      const after_P1_balance = await token.balanceOf(P1_address);
      expect(after_P1_p2_allowance).to.be.equals(P1_p2_allowance);
      expect(after_P1_balance).to.be.equals(P1_balance);
      expect(after_totalSupply).to.be.equals(totalSupply);
    });
  });

  describe("erc20-transferfrom-fail-exceed-balance()", () => {
    it("Function transferFrom Fails if the Requested Amount Exceeds the Available Balance.", async () => {
      const value = 100;
      const apprve = await token
        .connect(signers[3])
        .approve(signers[1].address, value);
      const allowance = await token.allowance(
        signers[3].address,
        signers[1].address
      );
      const fromBalance = await token.balanceOf(signers[3].address);
      expect(value).to.be.greaterThan(fromBalance);
      expect(fromBalance).to.be.greaterThanOrEqual(0);
      expect(fromBalance).to.be.lessThanOrEqual(ethers.constants.MaxUint256);

      const transaction = token
        .connect(signers[1])
        .transferFrom(signers[3].address, Owner, value);
      await expect(transaction).to.be.revertedWith(
        "ERC20: transfer amount exceeds balance"
      );
    });
  });
  describe("erc20-transferfrom-fail-exceed-allowance()", () => {
    it("Function transferFrom Fails if the Requested Amount Exceeds the Available Allowance.  ", async () => {
      const value = 1000;
      const apprve = await token.approve(signers[3].address, 100);
      const allowance = await token.allowance(Owner, signers[3].address);
      const fromBalance = await token.balanceOf(Owner);

      expect(value).to.be.greaterThan(allowance);
      expect(allowance).to.be.greaterThanOrEqual(0);
      expect(value).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      const transaction = token
        .connect(signers[3])
        .transferFrom(Owner, userOne, value);
      await expect(transaction).to.be.revertedWith(
        "ERC20: insufficient allowance"
      );
    });
  });

  describe("erc20-transferfrom-fail-recipient-overflow()", () => {
    it("Function transferFrom Prevents Overflows in the Recipient's Balance. ", async () => {
      const value =
        "115792089237316195423570985008687907853269984665640564039457584007913129639934";
      // 115792089237316195423570985008687907853269984665640564039457584007913129639935
      const tx = await token.transfer(userOne, 1000000000000000);
      const apprve = await token.approve(signers[3].address, value);
      let to_balalnce = await token.balanceOf(userOne);

      expect(Owner).to.not.equals(userOne);
      expect(to_balalnce.add(value)).to.be.greaterThan(
        ethers.constants.MaxUint256
      );
      expect(value).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      expect(to_balalnce).to.be.greaterThanOrEqual(0);
      expect(to_balalnce).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      const transaction = token
        .connect(signers[3])
        .transferFrom(Owner, toaddress, value);
      await expect(transaction).to.be.rejectedWith(
        "ERC20: transfer amount exceeds balance"
      );
    });
  });

  describe("erc20-transferfrom-false()", () => {
    it("If Function transferFrom Returns false , the Contract's State Has Not Been Changed. ", async () => {
      const value = 1000;
      const apprve = await token.approve(signers[3].address, 100);
      const allowance = await token.allowance(Owner, signers[3].address);
      const fromBalance = await token.balanceOf(Owner);
      const totalSupply = await token.totalSupply();

      expect(value).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      const transaction = token
        .connect(signers[3])
        .transferFrom(Owner, userOne, value);
      await expect(transaction).to.be.revertedWith(
        "ERC20: insufficient allowance"
      );
      const after_allowance = await token.allowance(Owner, signers[3].address);
      const after_fromBalance = await token.balanceOf(Owner);
      const after_totalSupply = await token.totalSupply();
      expect(after_allowance).to.be.equals(allowance);
      expect(after_fromBalance).to.be.equals(fromBalance);
      expect(after_totalSupply).to.be.equals(totalSupply);
    });
  });
  describe("erc20-transferfrom-never-return-false()", () => {
    it("Function transferFrom Never Returns false .", async () => {
      const value = 1000;
      const apprve = await token.approve(signers[1].address, value);
      const allowance = await token.allowance(Owner, signers[1].address);
      const transaction = await token
        .connect(signers[1])
        .transferFrom(Owner, toaddress, value);
    });
  });
  describe("erc20-transfer-recipient-overflow", () => {
    it("Function transfer Prevents Overflows in the Recipient's Balance.", async () => {
      const Sample = await ethers.getContractFactory("Token");
      let sample = await Sample.deploy(
        tokenName,
        tokenSymbol,
        "115792089237316195423570985008687907853269984665640564039457584007913129639935",
        Owner,
        Owner
      );
      await sample.deployed();
      const value = ethers.constants.MaxUint256;

      const tx = await sample.transfer(toaddress, 100);
      const to_balalnce = await sample.balanceOf(toaddress);
      const from_balance = await sample.balanceOf(Owner);

      expect(Owner).to.be.not.equals(TokenAddress);
      expect(to_balalnce.add(value)).to.be.greaterThan(
        ethers.constants.MaxUint256
      );
      expect(to_balalnce).to.be.greaterThanOrEqual(0);
      expect(to_balalnce).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      expect(from_balance).to.be.lessThanOrEqual(ethers.constants.MaxUint256);

      //expect(value).to.be.greaterThan(0);
      //expect(value).to.be.lessThanOrEqual(from_balance);
      const transaction = sample.transfer(userOne, value);
      await expect(transaction).to.be.revertedWith(
        "ERC20: transfer amount exceeds balance"
      );
    });
  });
  describe("Transfer()", () => {
    it("transfer should initiate from the owner account/address ", async () => {
      const from_balance = await token.balanceOf(Owner);
      const to_balance = await token.balanceOf(userOne);
      const transaction = await token.transfer(userOne, 100);
      const afterFrombalance = await token.balanceOf(Owner);
      const afterTobalance = await token.balanceOf(userOne);
      expect(afterFrombalance).to.equals(from_balance.sub(100));
      expect(afterTobalance).to.equals(to_balance.add(100));
    });
  });

  describe("erc20-transfer-revert-zero()", () => {
    it("transfer must fail if the recipient address is zero", async () => {
      const transaction = token.transfer(zero, 100);
      await expect(transaction).to.be.revertedWith(
        "ERC20: transfer to the zero address"
      );
    });
  });

  describe("erc20-transfer-succeed-normal()", () => {
    it("transfer must succeed on admissible non-self transfers", async () => {
      const value = 100;
      // const transaction = token.transfer(userOne, 100);
      const balanceOwner = await token.balanceOf(Owner);
      const balanceRecipient = await token.balanceOf(userOne);

      expect(userOne).to.not.equal(zero);
      expect(Owner).to.not.equal(userOne);
      expect(value).to.be.greaterThanOrEqual(0);
      expect(value).to.be.lessThanOrEqual(balanceOwner);
      expect(balanceRecipient.add(value)).to.be.lessThanOrEqual(
        ethers.constants.MaxUint256
      );
      expect(balanceRecipient).to.be.greaterThanOrEqual(zero);
      expect(balanceOwner).to.be.lessThanOrEqual(ethers.constants.MaxUint256);

      const transaction = token.transfer(userOne, 100);
    });
  });

  describe("erc20-transfer-succeed-self()", () => {
    it("transfer must succeed on admissible self transfers", async () => {
      const value = 100;
      // const transaction = token.transfer(userOne, 100);
      const balanceOwner = await token.balanceOf(Owner);

      expect(userOne).to.not.equal(zero);
      expect(Owner).to.equal(Owner);
      expect(value).to.be.greaterThanOrEqual(0);
      expect(value).to.be.lessThanOrEqual(balanceOwner);
      expect(balanceOwner).to.be.greaterThanOrEqual(zero);
      expect(balanceOwner).to.be.lessThanOrEqual(ethers.constants.MaxUint256);

      const transaction = token.transfer(userOne, 100);
    });
  });

  describe("erc20-transfer-correct-amount()", () => {
    it("transfers the correct amount in non-self transfers", async () => {
      const value = 100;
      // const transaction = token.transfer(userOne, 100);
      const from_balance = await token.balanceOf(Owner);
      const to_balance = await token.balanceOf(userOne);
      const balanceOwner = await token.balanceOf(Owner);
      const balanceRecipient = await token.balanceOf(userOne);

      expect(Owner).to.not.equal(userOne);
      expect(balanceRecipient).to.be.greaterThanOrEqual(zero);
      expect(value).to.be.greaterThanOrEqual(0);
      expect(balanceRecipient.add(value)).to.be.lessThanOrEqual(
        ethers.constants.MaxUint256
      );
      expect(balanceOwner).to.be.greaterThanOrEqual(zero);
      expect(balanceOwner).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      const transaction = await token.transfer(userOne, value);
      const afterfrom_balance = await token.balanceOf(Owner);
      const afterto_balance = await token.balanceOf(userOne);
      expect(afterfrom_balance).to.equals(from_balance.sub(100));
      expect(afterto_balance).to.equals(to_balance.add(100));
    });
  });

  describe("erc20-transfer-correct-amount-self()", () => {
    it("transfers the correct amount in self transfers", async () => {
      const value = 100;
      // const transaction = token.transfer(userOne, 100);
      const from_balance = await token.balanceOf(Owner);
      const to_balance = await token.balanceOf(userOne);
      const balanceOwner = await token.balanceOf(Owner);
      const balanceRecipient = await token.balanceOf(userOne);
      expect(Owner).to.equal(Owner);
      expect(balanceRecipient).to.be.greaterThanOrEqual(zero);
      expect(balanceOwner).to.be.lessThanOrEqual(ethers.constants.MaxUint256);
      const transaction = await token.transfer(Owner, value);
      const afterto_balance = await token.balanceOf(userOne);
      expect(afterto_balance).to.equals(to_balance);
    });
  });

  describe("erc20-transfer-change-state()", () => {
    it("transfer must not have unexpected state changes", async () => {
      const value = 100;
      // const transaction = token.transfer(userOne, 100);
      const from_balance = await token.balanceOf(Owner);
      const to_balance = await token.balanceOf(userOne);
      const totalSupply = await token.totalSupply();
      const P1_balance = await token.balanceOf(signers[5].address);
      const P1_allowance = await token.allowance(
        signers[5].address,
        signers[6].address
      );

      expect(userOne).to.not.equal(Owner);
      expect(userOne).to.not.equal(toaddress);

      const transaction = await token.transfer(userOne, value);
      const after_totalSupply = await token.totalSupply();
      const after_P1_balance = await token.balanceOf(signers[5].address);
      const after_P1_allowance = await token.allowance(
        signers[5].address,
        signers[6].address
      );
      const after_from_balance = await token.balanceOf(Owner);
      const after_to_balance = await token.balanceOf(userOne);

      expect(after_P1_allowance).to.be.equals(P1_allowance);
      expect(after_P1_balance).to.be.equals(P1_balance);
      expect(after_totalSupply).to.be.equals(totalSupply);
      expect(after_from_balance).to.be.equals(from_balance.sub(value));
      expect(after_to_balance).to.be.equals(to_balance.add(value));
    });
  });

  describe("erc20-transfer-exceed-balance()", () => {
    it("transfer must fail if requested amount exceeds the available balance", async () => {
      const value = 100;
      // const transaction = token.transfer(userOne, 100);
      const balanceUser = await token.balanceOf(signers[3].address);
      const balanceRecipient = await token.balanceOf(userOne);

      expect(value).to.be.greaterThan(balanceUser);
      expect(balanceUser).to.be.greaterThanOrEqual(0);
      expect(value).to.be.lessThanOrEqual(ethers.constants.MaxUint256);

      const transaction = token.connect(signers[3]).transfer(Owner, 100);
      await expect(transaction).to.be.revertedWith(
        "ERC20: transfer amount exceeds balance"
      );
    });
  });
  describe("erc20-transfer-false()", () => {
    it("transfer fails and contract state has not been changed ", async () => {
      const value = 100;

      const balanceUser = await token.balanceOf(Owner);
      const balanceuserOne = await token.balanceOf(userOne);
      const totalSupply = await token.totalSupply();
      const balance = await token.balanceOf(signers[5].address);
      const allowance = await token.allowance(
        signers[5].address,
        signers[6].address
      );

      const transaction = token.connect(signers[3]).transfer(zero, 100);
      await expect(transaction).to.be.revertedWith(
        "ERC20: transfer to the zero address"
      );

      const after_balanceUser = await token.balanceOf(Owner);
      const after_balanceuserOne = await token.balanceOf(userOne);
      const after_totalSupply = await token.totalSupply();
      const after_balance = await token.balanceOf(signers[5].address);
      const after_allowance = await token.allowance(
        signers[5].address,
        signers[6].address
      );
      expect(after_balanceUser).to.be.equals(balanceUser);
      expect(after_balanceuserOne).to.be.equals(balanceuserOne);
      expect(after_totalSupply).to.be.equals(totalSupply);
      expect(after_balance).to.be.equals(balance);
      expect(after_allowance).to.be.equals(allowance);
    });
  });

  describe("erc20-transfer-never-return-false()", () => {
    it("Function transfer never returns false", async () => {
      const value = 100;

      const transaction = token.transfer(userOne, 100);
    });
  });
  describe("erc20-balanceof-succeed-always()", () => {
    it("should successfully show the correct balance of Owner", async () => {
      const from_balance = await token.balanceOf(Owner);
    });
  });
  // checking balance of userOne (0)
  describe("erc20-balanceof-succeed-always()", () => {
    it("should successfully show correct balance of an user", async () => {
      const from_balance = await token.balanceOf(userOne);
      // expect(from_balance).to.equals("0")
    });
  });
  // Verifying balance of Owner (100000000000000000000000000)
  describe("erc20-balanceof-succeed-always()", () => {
    it("should successfully show correct balance of 1 billion", async () => {
      const from_balance = await token.balanceOf(Owner);
      expect(from_balance).to.equals("1000000000000000000000000000");
    });
  });
  // Verifying balance of userOne (0)
  describe("erc20-balanceof-succeed-always()", () => {
    it("should successfully show correct balance of 0", async () => {
      const from_balance = await token.balanceOf(userOne);
      expect(from_balance).to.equals("0");
    });
  });
  // showing correct balance of Owner (100000000000000000000000000)
  describe("erc20-balanceof-succeed-always()", () => {
    it("should show correct balance of Owner", async () => {
      const from_balance = await token.balanceOf(Owner);
    });
  });
  // showing correct balance of userOne (0)
  describe("erc20-balanceof-succeed-always()", () => {
    it("should show correct balance of an user", async () => {
      const from_balance = await token.balanceOf(userOne);
    });
  });
  /// erc20-balanceof-change-state

  describe("erc20-balanceof-change-state()", () => {
    it("should not change the contract's state", async () => {
      let beforeAllowance_balance: any;
      let afterAllowance_balance: any;
      beforeAllowance_balance = signers[3].address;
      const before_balance = await token.balanceOf(beforeAllowance_balance);
      const beforeAllowance = await token.allowance(Owner, signers[3].address);
      const after_balance = await token.balanceOf(beforeAllowance_balance);
      const afterAllowance = await token.allowance(Owner, signers[3].address);
      expect(before_balance).to.be.equal(after_balance);
      expect(beforeAllowance).to.be.equals(afterAllowance);
    });
  });
  /// erc20-allowance-succeed-always

  describe("erc20-balanceof-change-state()", () => {
    it("it should always succeed in giving allowance", async () => {
      let beforeTest: any;
      let afterTest: any;
      let testAddress = signers[4].address;

      beforeTest = await token.allowance(Owner, signers[4].address);
      afterTest = await token.allowance(Owner, signers[4].address);

      expect(beforeTest).to.be.equals(afterTest);
    });
  });
  describe("erc20-allowance-correct-value()", () => {
    it("should give correct value of allowance", async () => {
      let beforeTest: any;
      let afterTest: any;
      let value = 100;
      let testAddress = signers[5].address;

      // beforeTest = await token.allowance(Owner, signers[5].address);

      const approve = await token.approve(signers[5].address, value);

      afterTest = await token.allowance(Owner, signers[5].address);

      expect(afterTest).to.be.equals(value);
    });
  });
  /// erc20-allowance-change-state

  describe("erc20-allowance-change-state()", () => {
    it("should not change the contract's state", async () => {
      let beforeTest: any;
      let afterTest: any;
      let value = 100;
      let testAddress = signers[6].address;
      const approve = await token.approve(signers[6].address, value);
      const balance = await token.balanceOf(Owner);
      const totalSupply = await token.totalSupply();
      beforeTest = await token.allowance(Owner, testAddress);
      afterTest = await token.allowance(Owner, testAddress);
      const after_totalSupply = await token.totalSupply();
      const Afterbalance = await token.balanceOf(Owner);
      const after_balance = await token.balanceOf(Owner);
      expect(after_balance).to.be.equals(balance);
      expect(after_totalSupply).to.be.equals(totalSupply);
      expect(afterTest).to.be.equals(beforeTest);
    });
  });

  /// erc20-approve-change-state

  describe("erc20-approve-change-state()", () => {
    it("it should not have unexpected state changes", async () => {
      const value = 100;
      let P1_address = signers[7].address;
      let P2_address = signers[8].address;
      let beforeTest: any;
      let afterTest: any;
      expect(P1_address).to.not.equals(zero);
      const P1_balance = await token.balanceOf(P1_address);
      const totalSupply = await token.totalSupply();
      const P1_P2_allowance = await token.allowance(P1_address, P2_address);
      const approve = await token.approve(userOne, value);
      const after_P1_P2_allowance = await token.allowance(
        P1_address,
        P2_address
      );
      const after_P1_balance = await token.balanceOf(P1_address);
      const after_totalSupply = await token.totalSupply();

      expect(after_P1_P2_allowance).to.be.equals(P1_P2_allowance);
      expect(after_P1_balance).to.be.equals(P1_balance);
      expect(after_totalSupply).to.be.equals(totalSupply);
    });
  });
  /// erc20-approve-false

  describe("erc20-approve-false()", () => {
    it("should give equal balances after approval", async () => {
      const value = 100;
      let beforeTest: any;
      let afterTest: any;
      let testAddress = signers[9].address;

      const approve = await token.approve(signers[9].address, value);
      const balance = await token.balanceOf(Owner);
      const totalSupply = await token.totalSupply();

      const after_totalSupply = await token.totalSupply();
      const AfterBalance = await token.balanceOf(Owner);
      const after_balance = await token.balanceOf(Owner);
      expect(after_balance).to.be.equals(balance);
      expect(after_totalSupply).to.be.equals(totalSupply);
      expect(afterTest).to.be.equals(beforeTest);
    });
  });
  describe("erc20-approve-revert-zero()", () => {
    const value = 100;
    let P1_address = "0x0000000000000000000000000000000000000000";
    it("approve must fail if the spender address is zero", async () => {
      const approve = token.approve(P1_address, value);
      await expect(approve).to.be.revertedWith(
        "ERC20: approve to the zero address"
      );
    });
  });
  /// erc20-approve-succeed-normal

  describe("erc20-approve-succeed-normal()", () => {
    it("should succeed for admissible inputs", async () => {
      const value = 100;
      let P1_address = signers[10].address;
      const approve = token.approve(P1_address, value);
      const balance = await token.balanceOf(Owner);
      const totalSupply = await token.totalSupply();

      const after_totalSupply = await token.totalSupply();
      const AfterBalance = await token.balanceOf(Owner);
      const after_balance = await token.balanceOf(Owner);
      expect(after_balance).to.be.equals(balance);
      expect(after_totalSupply).to.be.equals(totalSupply);
    });
  });
  /// erc20-approve-correct-amount

  describe("erc20-approve-correct-amount()", () => {
    it("should update the approval mapping correctly", async () => {
      const value = 100;
      let userOne = signers[11].address;

      expect(value).to.be.greaterThanOrEqual(0);
      expect(userOne).to.not.equals(zero);
      expect(value).to.be.lessThanOrEqual(ethers.constants.MaxUint256);

      const transaction = await token.approve(userOne, value);
      const approve_amount = await token.allowance(Owner, userOne);

      expect(approve_amount).to.be.equals(value);
    });
  });
  /// erc20-approve-never-return-false
  describe("erc20-approve-never-return-false()", () => {
    it("should never return false", async () => {
      const value = 100;
      let P1_address = signers[12].address;
      const balance = await token.balanceOf(Owner);

      const approve = token.approve(P1_address, value);

      const after_totalSupply = await token.totalSupply();
      const AfterBalance = await token.balanceOf(Owner);
      const after_balance = await token.balanceOf(Owner);
      // const Userafter_balance = await token.balanceOf(P1_address);
      expect(after_balance).to.be.equals(balance);
      // expect(after_totalSupply).to.be.equals(totalSupply);
      // expect(Userafter_balance).to.be.equals(P1_address);
    });
  });
  describe("erc20-totalsupply-change-state()", () => {
    it("should not change the contract's state", async () => {
      const value = 100;
      let userOne = signers[12].address;

      const totalSupply = await token.totalSupply();
      const approve = token.approve(userOne, value);

      const after_totalSupply = await token.totalSupply();
      expect(after_totalSupply).to.be.equals(totalSupply);
    });
  });

  /// erc20-totalsupply-succeed-always

  describe("erc20-totalsupply-change-state()", () => {
    it("should successfully show total supply", async () => {
      const totalSupply = await token.totalSupply();
      const after_totalSupply = await token.totalSupply();
      expect(after_totalSupply).to.be.equals(totalSupply);
    });
  });

  /// erc20-totalsupply-correct-value

  describe("erc20-totalsupply-correct-value()", () => {
    it("should show correct total supply", async () => {
      const totalSupply = await token.totalSupply();
      expect(totalSupply).to.be.equals("1000000000000000000000000000");
    });
  });
});
