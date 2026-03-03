// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

/**
 * @title ORNG Flash Loan Arbitrage
 * @dev This contract borrows millions in assets (USDT/USDC) from Aave,
 * executes a profitable trade on a DEX (Uniswap/Sushi), and repays the loan.
 * 
 * NOTE: This allows access to MILLIONS of dollars in liquidity without owning it,
 * provided the trade is profitable.
 */
contract ORNGFlashLoan is FlashLoanSimpleReceiverBase {
    address payable owner;

    constructor(address _addressProvider)
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider))
    {
        owner = payable(msg.sender);
    }

    /**
     * @dev Executes the Flash Loan
     * @param asset The address of the asset to borrow (e.g., USDT)
     * @param amount The amount to borrow (e.g., 10,000,000 USDT)
     */
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        // 1. We now have the `amount` of `asset` (e.g. 10M USDT)
        
        // 2. Execute Arbitrage Logic (Buy Low on Uniswap, Sell High on Sushi)
        // logic goes here...
        
        // 3. Approve Aave to pull the funds back + premium (fee)
        uint256 amountOwed = amount + premium;
        IERC20(asset).approve(address(POOL), amountOwed);

        return true;
    }

    function requestFlashLoan(address _token, uint256 _amount) public {
        address receiverAddress = address(this);
        address asset = _token;
        uint256 amount = _amount;
        bytes memory params = "";
        uint16 referralCode = 0;

        POOL.flashLoanSimple(
            receiverAddress,
            asset,
            amount,
            params,
            referralCode
        );
    }

    function withdraw(address _tokenAddress) external onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    receive() external payable {}
}
