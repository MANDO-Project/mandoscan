// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {
    mapping(uint256 => string) private data;

    function storeData(uint256 key, string memory value) public {
        data[key] = value;
    }

    function retrieveData(uint256 key) public view returns (string memory) {
        return data[key];
    }
}