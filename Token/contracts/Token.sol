/**
 * SPDX-License-Identifier: MIT
 */

pragma solidity ^0.8.0;

import "./ERC20.sol";

/**
 *
 * This implementation of Token contract is inherited from ERC20
 * token smart contract from openzeplin library which is a standard
 * implementation of the {IERC20} interface.Please find below link for source-code
 * https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol
 *
 * That(Openzeplin's ERC20 contract) implementation is agnostic to
 * the way tokens are created. This means that a supply mechanism has to be
 * added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20PresetMinterPauser}.
 *
 * That(Openzeplin's ERC20 contract) contract follows OpenZeppelin guidelines:
 * functions revert instead of returning `false` on failure. This behavior
 * is nonetheless conventional and does not conflict with the expectations
 * of ERC20 applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 *
 */
contract Token is ERC20 {
    /**
     * @dev Sets the values for {name}, {symbol} and {initialSupply}.
     *
     * This function is used to initialize ERC20 token with token name,
     * token symbol (it's short symbol) and amount of initial tokens available.
     */
    constructor(string memory name_,
                string memory symbol_,
                uint256 initialSupply,
                address ownerAddress,
                address treasuryWallet
                ) ERC20(name_, symbol_) {
        _mint(treasuryWallet, initialSupply);
        transferOwnership(ownerAddress);
    }
}