import {ServerRespond} from './DataStreamer';

export interface Row {
    abcPrice: number,
    defPrice: number,
    ratio: number,
    timestamp: Date,
    lower_bound: number,
    upper_bound: number,
    trigger: number | undefined,
}


export class DataManipulator {
    static generateRow(serverRespond: ServerRespond[]): Row {
        const ABC = serverRespond[0];
        const DEF = serverRespond[1];
        const ABCPrice = (ABC.top_ask.price + ABC.top_bid.price) / 2;
        const DEFPrice = (DEF.top_ask.price + DEF.top_bid.price) / 2;
        const ratio = ABCPrice / DEFPrice;
        const lowerBound = 0.95;
        const upperBound = 1.05;
        return {
            abcPrice: ABCPrice,
            defPrice: DEFPrice,
            ratio,
            timestamp: ABC.timestamp > DEF.timestamp ?
                ABC.timestamp : DEF.timestamp,
            lower_bound: lowerBound,
            upper_bound: upperBound,
            trigger: (ratio < lowerBound || ratio > upperBound) ? ratio : undefined,
        };
    }
}