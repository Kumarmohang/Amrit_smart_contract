const Token = artifacts.require("Token");

contract("Token", function (accounts) {
  const [Owner, userOne, toaddress] = accounts;
  const NAME = "Amrit";
  const SYMBOL = "AMRT";
  const TOTAL_SUPPLY = "1000000000000000000000";
  const initialSupply = TOTAL_SUPPLY;
  let tokenTest = null;
  let token;

  beforeEach(async function () {
    token = await Token.deployed(NAME, SYMBOL, TOTAL_SUPPLY, Owner, Owner);
    // tokenTest = this.token
  });
  describe("Transfer()", () => {
    it("transfer should work from the owner account/address ", async () => {
      const from_balance = await token.balanceOf(Owner);
      const to_balalnce = await token.balanceOf(userOne);
      console.log({ from_balance });
      console.log({ to_balalnce });
      const transaction = await token.transfer(userOne, 100);
      const afterFrombalance = await token.balanceOf(Owner);
      const afterTobalance = await token.balanceOf(userOne);
      // expect(afterFrombalance).to.be.equals(from_balance.sub(100));
      // expect(afterFrombalance).to.equals(from_balance.sub(100));
      // expect(afterTobalance).to.equals(to_balalnce.add(100));
      // console.log({ afterFrombalance });
      // console.log({ afterTobalance });
    });
  });
});
