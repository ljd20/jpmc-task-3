import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  lower_bound: number,
  upper_bound: number,
  trigger: number | undefined,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) {
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const lowerBound = 1 - 0.05;
    const upperBound = 1 + 0.05;
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ? 
        serverResponds[0].timestamp : serverResponds[1].timestamp,
      lower_bound: lowerBound,
      upper_bound: upperBound,
      trigger: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
    };
  }
}
