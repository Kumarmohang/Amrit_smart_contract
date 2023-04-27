# Smart contracts for AMRIT Token

The AMRIT Token (AMR) is based on the ERC-20 standard.

## Methods

---

### Transfer

The function `transfer` transfers tokens from the caller's account to the recipient’s account. The one who invokes this function will be the caller. The caller will enter the `_recipient` account and the `_amount` to transfer.

This function also emits a `Transfer` Event.

### Transfer From

The function `transferFrom` transfers tokens from the sender’s account to the recipient account using the allowance functionality. The sender would have already assigned some allowance to the caller. The caller can then call this function to transfer `_amount` from `_sender` address to `_recipient` address. The `_amount` will be deducted from the caller’s allowance.

This function also emits a `Transfer` Event.

### Transfer with Hold

The function `transferWithHold` transfers tokens from the caller's account to the recipient’s account with a holding time. The one who invokes this function will be the `caller`. The `caller` will enter the `_recipient` account, the `_amount` to transfer and the `_endTime` (UNIX timestamp) after which the caller wants to unlock the tokens.<br />
E.g. If the caller wants to send 100 tokens to the recipient, but wants to lock the tokens for 6 months duration. Then the caller can call the transferWithHold function and specify the (current time + 6 months) in the \_endTime parameter. The recipient will not be able to transfer the tokens before 6 months.
After the holding time has passed, the recipient of the tokens will be able to view the tokens in the balanceOf() function.

This function also emits a `Transfer` Event.

Note: Only the Admins of the smart contract are allowed to execute this function. The Admins can be added by the owner of the smart contract with the addAdmin() function.

### Get Hold Balance

The function `getHoldBalance` returns the amount of the tokens of the `_account` address which are still in hold (locked).

### Approve

The function `approve` approves the amount as an allowance of the spender, which the spender is allowed to spend from the caller’s token balance.

### Allowance

The function `allowance` returns the remaining amount of tokens that the `_spender` will be allowed to spend on behalf of the `_owner`.

### Add Admin

The function `addAdmin` adds the `_account` address to the Admin list. The admins in this list will be able to call the `transferWithHold` function.

Note: This function can only be called by the owner of the smart contract.

### Is Admin

The function `isAdmin` returns True if the account address is in the list of admins.

### Remove Admin

The function `removeAdmin` removes the `_account` address from the Admin list.

Note: This function can only be called by the owner of the smart contract.

### Renounce Admin

The function `renounceAdmin` will be called by the admin himself in order to remove himself from the list of admins.

### Owner

The function `owner` returns the current owner address of the deployed smart contract.

### Transfer Ownership

The function `transferOwnership` transfers ownership of the contract to a new account (`newOwner`). This function can only be called by the current owner.

This function emits a `OwnershipTransferred` event.

Note: This function can only be called by the owner of the smart contract.

### Renounce Ownership

The function `renounceOwnership` will be called by the owner himself in order to remove himself from the owner role. This function leaves the contract without an owner.

This function emits a `OwnershipTransferred` event.

Note: This function can only be called by the owner of the smart contract. Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.

### Other functions

Other functions included are as per the ERC20 standard protocol

## Requirements to run this repository

---

You can compile, run tests and deploy this smart contract with Truffe.

- [Node.js](https://nodejs.org/download/release/latest-v10.x/): `>=16.7.0`
- [Truffle](https://www.trufflesuite.com/truffle): `v5.5.18`

## Usage

---

Clone or download this repository.

Go to path and run on terminal:

```sh
npm install
```

After running, all the dependecies will be downloaded.

You can also install truffle as a global dependency by running:

```sh
npm install -g truffle
```

### Compile contracts

---

```sh
truffle compile
```

After running, contract information including ABI will be available in the `build/` directory.

### Run tests on Truffle

---

You can run tests which can be found in the test directory `Token/test` by running on terminal:

```sh
truffle test
```

### Run migration and deploy contracts

---

Create .env file:

```
cp .env.template .env
```

Edit the below contents in .env file:

```
FROM_ADDRESS="0xabcd"   // Owner wallet address
PRIVATE_KEY="0x1234"   // From Address private key
MAINNET_URL="https://rinkeby.infura.io/v3/<INFURA_API_KEY>"   // Network connection url
GAS_LIMIT="4000000"
GAS_PRICE=20000000000
```

Edit the `token_config.json` and update the below details:

```
{
    "tokenName": "<TOKEN_NAME>",
    "tokenSymbol": "<TOKEN_SYMBOL>",
    "totalSupply": "<TOTAL_SUPPLY>"
}
```

It is important that the chosen wallet has sufficient balance for the payment of gas.

Run migrate command:

```sh
truffle migrate --network <network_name> // mainnet, rinkeby, ropsten...
```

## License

---

Smart contracts for AMRIT Token are available under the [licensing terms](LICENSE.md).
