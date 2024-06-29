// MyComponent.js
import React from 'react';

const MyComponent = () => {
    return (
        <div>
            <h1>Hello, World!</h1>
        </div>
    );
}

export default MyComponent;


$(document).ready(function () {
  

    $("#timestamp").on("click", function () {
        // Create a new Date object with your desired date and time
        const date = new Date('May 12, 2024');

        // Convert the date to a Unix timestamp (in milliseconds)
        const unixTimestamp = date.getTime() / 1000;

        console.log('unixTimestamp:', unixTimestamp);
    });



    $("#history").on("click", function () {
        fetch(`${apiData.url}${apiData.history}?symbol=BTCTMN&resolution=180&from=1718529734&to=1718637734`)
                    
            .then(response => response.json())
            .then(data => {
                console.log('history:', data);
                let closeHistory = exportClosePrice(data);
                console.log('closeHistory[0]:', closeHistory[0]);
            })
            .catch(error => {
                console.error('Error:', error);

            });
    });

    function exportClosePrice(data) {
        let closePrice = data.c;
        return closePrice;
    }

    $("#sendorder").on("click", function () {
        fetch(`${apiData.url}${apiData.order}`, {
            method: 'POST',
            body: JSON.stringify({
                symbol: "SHIBTMN",
                type: "LIMIT",
                side: "BUY",
                price: "0.8",
                quantity: "1000000"
            }),
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                console.log('sendorder:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    $("#profile").on("click", function () {
        fetch(`${apiData.url}${apiData.profile}`, {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                console.log('profile:', data.result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    $("#orderbook").on("click", function () {
        orderbook("SHIBTMN");
    });

    $("#marketslist").on("click", function () {
        fetch(`${apiData.url}${apiData.markets}`)
            .then(res => res.json())
            .then(data => {
                console.log('marketslist:', data.result);
                //showsymbols(data);
            })

    });

    function showsymbols(Data) {
        var allSymbolsObj = [];
        for (var i in Data.result.symbols) {
            allSymbolsObj.push(
                {
                    "symbol": Data.result.symbols[i].symbol,
                    "quoteAsset_png_icon": Data.result.symbols[i].quoteAsset_png_icon,
                    "quoteAsset": Data.result.symbols[i].quoteAsset
                }
            );
        }

        console.log(allSymbolsObj);
    }

    function orderbook(symbol) {
        fetch(`${apiData.url}${apiData.orderbook}?symbol=${symbol}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
    }
    ///////////////////////////////////////////////////////////////////////////////////
    function convertJsonToCsv(json) {
        const items = json;
        const replacer = (key, value) => (value === null ? '' : value);
        const header = Object.keys(items[0]);
        let csv = items.map(row =>
            header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
            .join('\n');

        csv = header.join(',') + '\n' + csv;

        return csv;
    }

    function downloadCsv(csv, filename) {
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    //const json = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }];
    //const csv = convertJsonToCsv(json);
    //downloadCsv(csv, 'output.csv');
    /////////////////////////////////////////////////////////////////////////////////////
});