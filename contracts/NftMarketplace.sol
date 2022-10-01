// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error NFTMarketplace__PriceMustBeAboveZero();
error NftMarketplace__NotApprovedForMarketplace();
error NftMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NotOwner();

contract NftMarketplace {
    struct Listing {
        uint256 price;
        address seller;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
    // NFT Contract address -> NFT TokenID -> Listing
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    ///////////////////////
    /// Main Functions ///
    //////////////////////

    ///////////////////////
    /// Modifiers ///
    //////////////////////
    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert NftMarketplace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NftMarketplace__NotOwner();
        }
        _;
    }
    /*
    * @notice Method for listing your NFT on th marketplace
    * @param nftAddress: Address of the NFT
    * @param tokenId: The Token ID of the NFT
    * @param price: sale of the listed NFT
    * @dev Technically, we could have the contract be the escrow for the NFTs
    * but this way people can still hold their NFTs when listed
    */ 
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external notListed(nftAddress, tokenId, msg.sender) isOwner(nftAddress, tokenId, msg.sender) {
        if (price <= 0) {
            revert NFTMarketplace__PriceMustBeAboveZero();
        }
        // Owners of NFTs can still hold their NFT, and give the marketplace approval to sell the NFT for them.
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketplace__NotApprovedForMarketplace();
        }
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }
    //  Create a decentralized NFT Marketplace
    //    1. `listItem`: List NFTs on the marketplace
    //    2. `buyItem`: Buy the NFTs
    //    3. `cancelItem`: Cancel a listing
    //    4. `updateListing`: Update Price
    //    5. `withdrawProceeds`: Withdraw payment for my bought NFTs
}
