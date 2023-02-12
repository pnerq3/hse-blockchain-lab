const { ethers } = require("hardhat");

async function main() {
    console.log('Getting the fun token contract...');
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const someToken = await ethers.getContractAt('SomeToken', contractAddress);

    console.log('Querying token name...');
    const name = await someToken.name();
    console.log(`Token Name: ${name}\n`);

    console.log('Querying token symbol...');
    const symbol = await someToken.symbol();
    console.log(`Token Symbol: ${symbol}\n`);

    console.log('Querying decimals...');
    const decimals = await someToken.decimals();
    console.log(`Token Decimals: ${decimals}\n`);

    console.log('Querying token supply...');
    const totalSupply = await someToken.totalSupply();
    console.log(`Total Supply including all decimals: ${totalSupply}`);
    console.log(`Total supply including all decimals comma separated: ${ethers.utils.commify(totalSupply)}`);
    console.log(`Total Supply in FUN: ${ethers.utils.formatUnits(totalSupply, decimals)}\n`);

    console.log('Getting the balance of contract owner...');
    const signers = await ethers.getSigners();
    const ownerAddress = signers[0].address;
    let ownerBalance = await someToken.balanceOf(ownerAddress);
    console.log(`Contract owner at ${ownerAddress} has a ${symbol} balance of ${ethers.utils.formatUnits(ownerBalance, decimals)}\n`);

    console.log('Initiating a transfer...');
    const recipientAddress = signers[1].address;
    const transferAmount = 100000;
    console.log(`Transferring ${transferAmount} ${symbol} tokens to ${recipientAddress} from ${ownerAddress}`);
    await someToken.transfer(recipientAddress, ethers.utils.parseUnits(transferAmount.toString(), decimals));
    console.log('Transfer completed');
    ownerBalance = await someToken.balanceOf(ownerAddress);
    console.log(`Balance of owner (${ownerAddress}): ${ethers.utils.formatUnits(ownerBalance, decimals)} ${symbol}`);
    let recipientBalance = await someToken.balanceOf(recipientAddress);
    console.log(`Balance of recipient (${recipientAddress}): ${ethers.utils.formatUnits(recipientBalance, decimals)} ${symbol}\n`);

    console.log(`Setting allowance amount of spender over the caller\'s ${symbol} tokens...`);
    const approveAmount = 10000;
    console.log(`This example allows the contractOwner to spend up to ${approveAmount} of the recipient\'s ${symbol} token`);
    const signerContract = someToken.connect(signers[1]); // Creates a new instance of the contract connected to the recipient
    await signerContract.approve(ownerAddress, ethers.utils.parseUnits(approveAmount.toString(), decimals));
    console.log(`Spending approved\n`);

    console.log(`Getting the contractOwner spending allowance over recipient\'s ${symbol} tokens...`);
    let allowance = await someToken.allowance(recipientAddress, ownerAddress);
    console.log(`contractOwner Allowance: ${ethers.utils.formatUnits(allowance, decimals)} ${symbol}\n`);

    const transferFromAmount = 100;
    console.log(`contractOwner transfers ${transferFromAmount} ${symbol} from recipient\'s account into own account...`);
    await someToken.transferFrom(recipientAddress, ownerAddress, ethers.utils.parseUnits(transferFromAmount.toString(), decimals));
    ownerBalance = await someToken.balanceOf(ownerAddress);
    console.log(`New owner balance (${ownerAddress}): ${ethers.utils.formatUnits(ownerBalance, decimals)} ${symbol}`);
    recipientBalance = await someToken.balanceOf(recipientAddress);
    console.log(`New recipient balance (${recipientAddress}): ${ethers.utils.formatUnits(recipientBalance, decimals)} ${symbol}`);
    allowance = await someToken.allowance(recipientAddress, ownerAddress);
    console.log(`Remaining allowance: ${ethers.utils.formatUnits(allowance, decimals)} ${symbol}\n`);

    try {
        const badTransferAmount = 10000;
        // Try transferring more than allowed
        console.log(`contractOwner tries to transfer ${badTransferAmount} ${symbol} from recipient\'s account into own account...`);
        await someToken.transferFrom(recipientAddress, ownerAddress, ethers.utils.parseUnits(badTransferAmount.toString(), decimals));
    } catch (e) {
        // "insufficient allowance"
        console.log(`Error: ${e}`)
    }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
