export type PriceData = {
    symbol: string;
    price: number;
    fetchFrom: string;
    timestamp: number;
  };

export type BitfinexData = {
    mid: string,
    bid: string,
    ask: string,
    last_price: string,
    low: string,
    high: string,
    volume: string,
    timestamp: string
}