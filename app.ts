import { Chainlink } from './src/fetchChainlink';
import { Bitfinex } from './src/fetchBitfinex';
import { MySQL } from './src/storeSql';

import cron from 'node-cron';
import dotenv from 'dotenv';
dotenv.config();

//check enviorment process
if (!process.env.CHAINLINK_TOKEN_SYMBOLS ||
    !process.env.CHAINLINK_TOKEN_ADDRESS ||
    !process.env.BITFINEX_TOKEN_SYMBOLS ||
    !process.env.BITFINEX_TOKEN_ADDRESS) {
    console.error('Error: Price Token Data are missing!');
    process.exit(1); 
}

if (!process.env.DB_HOST || 
    !process.env.DB_USER || 
    !process.env.DB_PASSWORD || 
    !process.env.DB_DATABASE ||
    !process.env.DB_DATATABLE) {
    console.error('Error: Database configuration is missing!');
    process.exit(1); 
}

const chainlinkTokenSymbols = process.env.CHAINLINK_TOKEN_SYMBOLS.split(',');
const chainlinkTokenAddress = process.env.CHAINLINK_TOKEN_ADDRESS.split(',');

const bitfinexTokenSymbols = process.env.BITFINEX_TOKEN_SYMBOLS.split(',');
const bitfinexTokenAddress = process.env.BITFINEX_TOKEN_ADDRESS.split(',');

//check having a same length
if (chainlinkTokenSymbols.length !== chainlinkTokenAddress.length ||
    bitfinexTokenSymbols.length !== bitfinexTokenAddress.length) {
    console.error('Error: The number of token symbols does not match the number of addresses!');
    process.exit(1);
}

let bitfinex = new Bitfinex()
let chainlink = new Chainlink()
let mysql = new MySQL(
    process.env.DB_HOST,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    process.env.DB_DATABASE,
    process.env.DB_DATATABLE
)

// run task function every 30 seconds
cron.schedule('*/30 * * * * *', () => {
    task();
});

function task(): void {
    const chainlinkPromises = chainlinkTokenSymbols.map((token, index) => 
        chainlink.fetchTokenPrice(token, chainlinkTokenAddress[index])
    );
    
    const bitfinexPromises = bitfinexTokenSymbols.map((token, index) => 
        bitfinex.fetchTokenPrice(token, bitfinexTokenAddress[index])
    );

    Promise.all(
        [...chainlinkPromises, ...bitfinexPromises]
        ).then((results) => {
        console.log(results);
        
        // Call insertPriceData to store results in MySQL.
        mysql.insertPriceData(results).catch(console.error);

    }).catch(error => {
       console.error(error);
   });
}