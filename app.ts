import { Chainlink } from './src/fetchChainlink';
import { Bitfinex } from './src/fetchBitfinex';

let bitfinex = new Bitfinex()
let chainlink = new Chainlink()

Promise.all([
    bitfinex.fetchTokenPrice("USDT", "USTUSD"),
    bitfinex.fetchTokenPrice("USDC", "UDCUSD"),
    bitfinex.fetchTokenPrice("ETH", "ETHUSD"),
    chainlink.fetchTokenPrice("DAI/BNB", "0x0630521aC362bc7A19a4eE44b57cE72Ea34AD01c"),
    chainlink.fetchTokenPrice("ETH/USD", "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7")
]).then((results) => {
    console.log(results);
}).catch(error => {
    console.error(error);
});