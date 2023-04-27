//SPDX-License-Identifier: MIT
/*
 * This code has not been reviewed.
 * Do not use or deploy this code before reviewing it personally first.
 */
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Roles.sol";

/**
 * @title AdminRole
 * @dev Admins are responsible for minting new tokens.
 */
contract AdminRole is Ownable {
    using Roles for Roles.Role;

    /**
     * @dev Emitted when `account` is added in the Admin list.
     */
    event AdminAdded(address indexed account);
    /**
     * @dev Emitted when `account` is removed from the Admin list.
     */
    event AdminRemoved(address indexed account);

    Roles.Role private _Admins;

    /**
     * @dev Initializes the contract setting the deployer as the Admin.
     */
    constructor () {
        _addAdmin(msg.sender);
    }

    /**
     * @dev Throws if called by any account other than the Admin.
     */
    modifier onlyAdmin() {
        require(isAdmin(msg.sender), "AdminRole: caller is not the Admin");
        _;
    }

    /**
     * @dev Returns `true` if `account` is in the Admin list.
     * @param account The account address to be checked
     */
    function isAdmin(address account) public view returns (bool) {
        return _Admins.has(account);
    }

    /**
     * @dev Adds the `account` address in the Admin list.
     * @param account The account address to be added
     * Emits an {AdminAdded} event.
     */
    function addAdmin(address account) external onlyOwner {
        _addAdmin(account);
    }

    /**
     * @dev Removes the `account` address from the Admin list.
     * @param account The account address to be removed
     * Emits an {AdminRemoved} event.
     */
    function removeAdmin(address account) external onlyOwner {
        require(isAdmin(account), "AdminRole: arg account is not the Admin");
        _removeAdmin(account);
    }

    /**
     * @dev Removes the `account` address from the Admin list.
     * Note: This will remove the caller from the Admin list.
     * Emits an {AdminRemoved} event.
     */
    function renounceAdmin() public {
        require(isAdmin(msg.sender), "AdminRole: caller is not the Admin");
        _removeAdmin(msg.sender);
    }

    function _addAdmin(address account) internal {
        _Admins.add(account);
        emit AdminAdded(account);
    }

    function _removeAdmin(address account) internal {
        _Admins.remove(account);
        emit AdminRemoved(account);
    }
}
