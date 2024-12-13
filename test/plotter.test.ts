import { BackTest, Side, type Trade } from 'backmark';
import { SmaStrategy } from './strategies/smaStrategy.js';

import { expect } from 'chai';
import { TradePlotter } from '../src/index.js';

describe('Plotter', function () {
    it('Should generate an HTML file with the equity curve', async function () {
        const options = {
            accountBalance: 1000,
            fee: 1.5,
            productName: 'BTC-USD',
        };
        const backTest = new BackTest('./test/data/btcusd_short.csv', SmaStrategy, options);

        await backTest.run();

        const result = backTest.getResult();

        const plotter = new TradePlotter(result.tradeHistory);
        plotter.plot();
    });
});
