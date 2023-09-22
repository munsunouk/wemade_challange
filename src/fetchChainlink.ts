import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { PriceData } from './utils';

const chainLinkOracleAbi = require('../../abis/ChainLinkOracle_abi.json');

export class Chainlink {

    public name : string
    public chain : string
    public rpc_url : string

    constructor(
        name : string = "chainlink",
        chain : string = "bsc_testnet",
        rpc_url : string = "https://bsc-testnet.publicnode.com",
    ) {
        this.name = name;
        this.chain = chain;
        this.rpc_url = rpc_url;
    }

    /**
     * @method
     * @name fetchTokenPrice
     * @description Fetches the price of a specific token from a blockchain network using Chainlink oracle.
     * @see https://docs.chain.link/
     * @param {string} tokenSymbol - The symbol of the token (e.g., "DAI/BNB").
     * @param {string} tokenAddress - The blockchain address of the token (e.g., "0x0630521aC362bc7A19a4eE44b57cE72Ea34AD01c").
     * @returns {Promise<PriceData>} A promise that resolves with an object containing data about the fetched price. 
     */
    public async fetchTokenPrice(
        tokenSymbol : string,
        tokenAddress: string,
    ): Promise<PriceData>{
        const provider = new ethers.JsonRpcProvider(this.rpc_url);
        const checksummedTokenAddress = ethers.getAddress(tokenAddress);
        const tokenContract = new ethers.Contract(checksummedTokenAddress, chainLinkOracleAbi, provider);
        
        const [roundData, decimals] = await Promise.all([
            tokenContract.latestRoundData(),
            tokenContract.decimals(),
        ]);
    
        const priceData: PriceData = {
            symbol: tokenSymbol,
            price: this.fromWei(new BigNumber(roundData[1].toString()), decimals).toNumber(),
            fetchFrom : this.name,
            timestamp : Number(roundData[3])
        };
    
        return priceData;
    };

    private fromWei(value: BigNumber, decimals: number): BigNumber {
        return value.shiftedBy(-Number(decimals)).decimalPlaces(Number(decimals), BigNumber.ROUND_FLOOR);
    }
    
}