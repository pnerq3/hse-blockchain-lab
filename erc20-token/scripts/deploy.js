const { ethers } = require("hardhat");

async function main() {

  // Get the contract owner
  const contractOwner = await ethers.getSigners();
  console.log(`Deploying contract from: ${contractOwner[0].address}`);

  // Hardhat helper to get the ethers contractFactory object
  const SomeToken = await ethers.getContractFactory('SomeToken');

  // Deploy the contract
  console.log('Deploying SomeToken...');
  const someToken = await SomeToken.deploy();
  await someToken.deployed();
  console.log(`someToken deployed to: ${someToken.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
