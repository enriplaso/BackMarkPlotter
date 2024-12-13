import * as fs from 'fs';
import * as path from 'path';
import { Side, Trade } from 'backmark'; // Adjust the import based on your file structure

export class TradePlotter {
    private trades: Trade[];

    constructor(trades: Trade[]) {
        this.trades = trades;
    }

    public plot(outputFilePath: string = 'trades_plot.html'): void {
        const timestamps = this.trades.map((trade) => trade.createdAt.toISOString());
        const balances = this.trades.map((trade) => trade.balanceAfterTrade || 0);

        const trace = {
            x: timestamps,
            y: balances,
            mode: 'lines+markers',
            name: 'Equity Curve',
            line: { color: 'blue' },
            marker: { size: 6, color: 'red' },
        };

        const layout = {
            title: 'Equity Curve',
            xaxis: {
                title: 'Timestamp',
                showgrid: true,
                zeroline: false,
            },
            yaxis: {
                title: 'Balance',
                showline: false,
            },
        };

        const data = [trace];

        // Generate the Plotly plot HTML
        const plotHtml = `
            <html>
                <head>
                    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
                </head>
                <body>
                    <div id="plot"></div>
                    <script>
                        const data = ${JSON.stringify(data)};
                        const layout = ${JSON.stringify(layout)};
                        Plotly.newPlot('plot', data, layout);
                    </script>
                </body>
            </html>
        `;

        fs.writeFileSync(path.resolve(outputFilePath), plotHtml);
        console.log(`Plot saved to ${outputFilePath}`);
    }
}

// Example Usage
// import { Side } from './types'; // Assuming the Side enum is defined in types

const trades: Trade[] = [
    {
        orderId: '1',
        price: 100,
        side: Side.BUY,
        quantity: 1,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        balanceAfterTrade: 1000,
    },
    {
        orderId: '2',
        price: 120,
        side: Side.SELL,
        quantity: 1,
        createdAt: new Date('2023-01-02T10:00:00Z'),
        balanceAfterTrade: 1120,
    },
];

const plotter = new TradePlotter(trades);
plotter.plot();
