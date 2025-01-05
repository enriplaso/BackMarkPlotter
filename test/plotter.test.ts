import { BackTest } from 'backmark';
import { SmaStrategy } from './strategies/smaStrategy.js';
import { expect } from 'chai';
import { TradePlotter } from '../src/index.js';
import { access } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const filePath = path.join(__dirname, '../trades_plot.html');

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

        const exists = await checkFileExists(filePath);
        expect(exists).to.be.true;
    });
});

async function checkFileExists(filePath: string): Promise<boolean> {
    try {
        await access(filePath); // Check file access
        return true;
    } catch (err) {
        console.error(err);
    }
    return false;
}
