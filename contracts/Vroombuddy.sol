// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vroombuddy is Ownable {
    IERC20 public usdc;
    enum InsuranceType {
        None,
        Standard,
        Premium,
        FullCover
    }
    uint256 public standardPremium = 50 * 10 ** 6; // 50 USDC in smallest unit
    uint256 public premiumPremium = 100 * 10 ** 6; // 100 USDC in smallest unit
    uint256 public fullCoverPremium = 150 * 10 ** 6; // 150 USDC in smallest unit

    struct PolicyHolder {
        InsuranceType insuranceType;
        uint256 lastPaymentTime;
        uint256 claimableAmount;
    }

    mapping(address => PolicyHolder) public policyHolders;
    mapping(address => uint256) public balances;

    event InsuranceJoined(address indexed user, InsuranceType insuranceType);
    event PremiumPaid(address indexed user, uint256 amount);
    event InsuranceClaimed(address indexed user, uint256 amount);
    event ClaimAllowed(address indexed user, uint256 amount);

    constructor(
        address _initialOwner,
        address _usdcAddress
    ) Ownable(_initialOwner) {
        usdc = IERC20(_usdcAddress);
    }

    function addFund(uint amount) external onlyOwner {
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "USDC transfer failed"
        );
        balances[msg.sender] += amount;
    }

    function joinInsurance(InsuranceType insuranceType) external {
        require(insuranceType != InsuranceType.None, "Invalid insurance type");
        require(
            policyHolders[msg.sender].insuranceType == InsuranceType.None,
            "Already joined insurance"
        );

        policyHolders[msg.sender].insuranceType = insuranceType;
        policyHolders[msg.sender].lastPaymentTime = block.timestamp;

        emit InsuranceJoined(msg.sender, insuranceType);
    }

    function payPremium() external {
        PolicyHolder storage holder = policyHolders[msg.sender];
        require(
            holder.insuranceType != InsuranceType.None,
            "Not enrolled in any insurance type"
        );

        uint256 premiumAmount = getPremiumAmount(holder.insuranceType);
        require(
            usdc.transferFrom(msg.sender, address(this), premiumAmount),
            "USDC transfer failed"
        );

        holder.lastPaymentTime = block.timestamp;
        emit PremiumPaid(msg.sender, premiumAmount);
    }

    function autoDeductPremium(address user) external onlyOwner {
        PolicyHolder storage holder = policyHolders[user];
        require(
            holder.insuranceType != InsuranceType.None,
            "User not enrolled in any insurance type"
        );

        uint256 premiumAmount = getPremiumAmount(holder.insuranceType);
        require(
            usdc.allowance(user, address(this)) >= premiumAmount,
            "User has not approved enough USDC"
        );
        require(
            usdc.transferFrom(user, address(this), premiumAmount),
            "USDC transfer failed"
        );

        holder.lastPaymentTime = block.timestamp;
        emit PremiumPaid(user, premiumAmount);
    }

    // 관리자가 특정 유저의 보험금 청구 권한을 부여
    function allowClaim(address user, uint256 amount) external onlyOwner {
        PolicyHolder storage holder = policyHolders[user];
        require(
            holder.insuranceType != InsuranceType.None,
            "User not enrolled in any insurance type"
        );

        holder.claimableAmount += amount;
        emit ClaimAllowed(user, amount);
    }

    // 사용자가 보험금을 청구할 수 있는지 확인
    function isClaimable(address user) public view returns (bool) {
        PolicyHolder storage holder = policyHolders[user];
        return holder.claimableAmount > 0;
    }

    // 사용자가 보험금을 청구하고 USDC를 수령
    function claimInsurance() external {
        PolicyHolder storage holder = policyHolders[msg.sender];
        require(
            holder.insuranceType != InsuranceType.None,
            "Not enrolled in any insurance type"
        );
        require(
            holder.claimableAmount > 0,
            "You are not allowed to claim insurance"
        );
        require(
            holder.claimableAmount <= usdc.balanceOf(address(this)),
            "Not enough funds in the contract"
        );

        holder.claimableAmount = 0;
        require(
            usdc.transfer(msg.sender, holder.claimableAmount),
            "USDC transfer failed"
        );

        emit InsuranceClaimed(msg.sender, holder.claimableAmount);
    }

    function getPremiumAmount(
        InsuranceType insuranceType
    ) public view returns (uint256) {
        if (insuranceType == InsuranceType.Standard) {
            return standardPremium;
        } else if (insuranceType == InsuranceType.Premium) {
            return premiumPremium;
        } else if (insuranceType == InsuranceType.FullCover) {
            return fullCoverPremium;
        } else {
            return 0;
        }
    }
}
