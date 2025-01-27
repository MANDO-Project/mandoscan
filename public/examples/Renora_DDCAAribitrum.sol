pragma solidity ^0.8.0;
import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import {TransferHelper} from "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import {ERC20DDCAManager} from "../../../core/contracts/ERC20DDCAManager.sol";
import {MathUtils} from "../../../core/libraries/MathUtils.sol";
contract DDCAAribitrum is ERC20DDCAManager {
    ISwapRouter private immutable _swapRouter;
    constructor(
        address _baseToken,
        address _quoteToken,
        address _routerAddress
    ) ERC20DDCAManager(_baseToken, _quoteToken) {
        _swapRouter = ISwapRouter(_routerAddress);
    }
    function _swapExactInputSingle(
        PurchaseDipInputs memory _purchaseDipInputs,
        uint160 _sqrtPriceLimitX96,
        uint24 _poolFee
    ) private {
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: address(quoteToken),
                tokenOut: address(baseToken),
                fee: _poolFee,
                recipient: address(this),
                deadline: block.timestamp + 5,
                amountIn: _purchaseDipInputs.swapAmount,
                amountOutMinimum: _purchaseDipInputs.minAmountOutExpected,
                sqrtPriceLimitX96: _sqrtPriceLimitX96
            });
        try _swapRouter.exactInputSingle(params) returns (uint256 _amountOut) {
            _onPurchaseDip(
                _purchaseDipInputs.swapAmount,
                _amountOut,
                _purchaseDipInputs.minAmountOutExpected,
                _purchaseDipInputs.feeAmount
            );
        } catch (bytes memory reason) {
            emit DexError({message: reason});
        }
    }
    function purchaseDips(
        uint256 toleratedSlippagePrice,
        uint160 sqrtPriceLimitX96,
        uint24 poolFee
    ) public onlyOwner lock {
        _swapInProgress = true;
        if (_totalLotSize <= 0) {
            revert ValidationError({message: "Not enough funds to swap"});
        }
        PurchaseDipInputs memory purchaseDipInputs = _getPurchaseDipInputs(
            toleratedSlippagePrice
        );
        TransferHelper.safeApprove(
            address(quoteToken),
            address(_swapRouter),
            purchaseDipInputs.swapAmount
        );
        _swapExactInputSingle(purchaseDipInputs, sqrtPriceLimitX96, poolFee);
        _swapInProgress = false;
    }
}