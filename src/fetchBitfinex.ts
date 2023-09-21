import { PriceData, BitfinexData } from './utils';

const fetch = require('node-fetch');

export class Bitfinex {
    public name : string
    public api_url : string

    constructor(
        name : string = "bitfinex",
        api_url : string = "https://api.bitfinex.com/v1/pubticker/",
    ) {
        this.name = name;
        this.api_url = api_url;
    }
    
    /**
     * @method
     * @name fetchTokenPrice
     * @description Fetches the price of a specific token from an exchange API.
     * @see https://docs.bitfinex.com/docs
     * @param {string} tokenSymbol - The symbol of the token (e.g., "USDT").
     * @param {string} tokenAddress - The symbol of the token bitfinex given (e.g., "USTUSD").
     * @returns {Promise<PriceData>} A promise that resolves with an object containing data about the fetched price. 
     */
    public async fetchTokenPrice(
        tokenSymbol : string,
        tokenAddress: string,
    ): Promise<PriceData>{
        const url = this.api_url + tokenAddress;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const response_json = await response.json() as BitfinexData;
    
        const priceData: PriceData = {
            symbol: tokenSymbol,
            price: Number(response_json['mid']),
            fetchFrom : this.name,
            timestamp : Number(response_json['timestamp'])
        };
    
        return priceData;
    };
} 