import { ethers } from 'ethers';

const assignABI = require('../../abis/Assignment_abi.json');

export class Donate {

    public name : string
    public chain : string
    public rpc_url : string
    public contractAddress : string

    constructor(
        name : string = "donate",
        chain : string = "bsc_testnet",
        rpc_url : string = "https://bsc-testnet.publicnode.com",
        contractAddress : string = "0xbe7a57ae3296b072547910212855f6e30986aa0f"

    ) {
        this.name = name;
        this.chain = chain;
        this.rpc_url = rpc_url;
        this.contractAddress = contractAddress;
    }

    /**
     * @method
     * @name donate
     * @description Send a transaction to donate to the Assignment contract.
     * @param {string} privateKey - The private key of the wallet that will be used for donation.
     * @param {number} amount - The amount in Ether to donate.
     */
    public async donate(privateKey :string, amount :string): Promise<void> {
        const provider = new ethers.JsonRpcProvider(this.rpc_url);
        const walletWithProvider = new ethers.Wallet(privateKey, provider);
        const checksummedContractAddress = ethers.getAddress(this.contractAddress);
  
        const assignmentContract = new ethers.Contract(checksummedContractAddress, assignABI, walletWithProvider);
  
        try {

            const amountWei = ethers.parseEther(amount);

            const txResponse = await assignmentContract.donate({ value: amountWei });
            
            // Wait for transaction confirmation
            const receipt  = await txResponse.wait();

            // Check the status of the transaction
            if (receipt.status === 0) {
                throw new Error('Failed to donate on Transaction');
            }

            console.log(`Transaction was confirmed, Transaction hash: ${txResponse.hash}`);
        } catch (error) {
            console.error(`Failed to donate: ${error}`);
        }
    };
    
}