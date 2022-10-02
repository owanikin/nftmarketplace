// const { assert } = require("chai")
// const { network, ethers, getNamedAccounts, deployments } = require("hardhat")
// const { developmentChains } = require("../../helper-hardhat-config")

// !developmentChains.includes(network.name)
//     ? describe.skip
//     : describe("NFT Marketplace Tests", function () {
//         let nftMarketplace, basicNft, deployer
//         const PRICE = ethers.utils.parseEther("0.1")
//         const TOKEN_ID = 0
//         beforeEach(async function () {
//             deployer = (await getNamedAccounts()).deployer
//             // player = (await getNamedAccounts()).player
//             const accounts = await ethers.getSigners()
//             player = accounts[1]
//             await deployments.fixture(["all"])
//             nftMarketplace = await ethers.getContract("NftMarketplace")
//             basicNft = await ethers.getContract("BasicNft")
//             await basicNft.mintNft()
//             await basicNft.approve(nftMarketplace.address, TOKEN_ID)
//             await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
//         })

//         it("lists and can be bought", async function () {
//             await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
//             const playerConnectedNftMarketplace = nftMarketplace.connect(player)
//             await playerConnectedNftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
//                 value: PRICE,
//             })
//             const newOwner = await basicNft.ownerOf(TOKEN_ID)
//             const deployerProceeds = await nftMarketplace.getProceeds(deployer)
//             await assert(newOwner.toString() == player.address)
//             await assert(deployerProceeds.toString() == PRICE.toString())
//         })
//     })

const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Nft Marketplace Unit Tests", function () {
          let nftMarketplace, nftMarketplaceContract, basicNft, basicNftContract
          const PRICE = ethers.utils.parseEther("0.1")
          const TOKEN_ID = 0

          beforeEach(async () => {
              accounts = await ethers.getSigners() // could also do with getNamedAccounts
              deployer = accounts[0]
              user = accounts[1]
              await deployments.fixture(["all"])
              nftMarketplaceContract = await ethers.getContract("NftMarketplace")
              nftMarketplace = nftMarketplaceContract.connect(deployer)
              basicNftContract = await ethers.getContract("BasicNft")
              basicNft = await basicNftContract.connect(deployer)
              await basicNft.mintNft()
              await basicNft.approve(nftMarketplaceContract.address, TOKEN_ID)
          })

          describe("listItem", function () {
              it("emits an event after listing an item", async function () {
                  expect(await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)).to.emit(
                      "ItemListed"
                  )
              })
          })
      })
