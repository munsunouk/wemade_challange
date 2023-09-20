import { PriceData, BitfinexData } from './utils';

const fetch = require('node-fetch');

export class Bitfinex {
    name : string
    api_url : string

    constructor(
        name : string = "bitfinex",
        api_url : string = "https://api.bitfinex.com/v1/pubticker/",
    ) {
        this.name = name;
        this.api_url = api_url;
    }

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