import * as fs from 'fs';
import * as path from 'path';
import { Trade } from 'backmark-common-types';

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
