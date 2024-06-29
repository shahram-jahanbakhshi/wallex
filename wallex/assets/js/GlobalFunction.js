const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('X-API-Key', '9080|gvP9tDYFqqpb9NMx0rS69CZXltd445EKuD2l9w5C');

let apiData = {
    url: 'https://api.wallex.ir/',
    markets: 'v1/markets',
    currencies: 'v1/currencies/stats',
    orderbook: 'v1/depth',
    profile: 'v1/account/profile',
    order: 'v1/account/orders',
    history: 'v1/udf/history',
    realPrice: 'v1/account/otc/price'
}
/**
     * 
     * @param {string} symbol
     * @param {string} side
     */
function getRealPrice(symbol, side) {
    $.post('/Home/getRealPrice', { symbol: symbol, side: side })
        .done(function (res) {
            console.log("res:", res)
        });
}
/**
 * 
 * @param {string} symbol
 * @param {string} side
 */
function getRealTimePrice(symbol, side) {
    let success = false;
    let result = {};
    fetch(`${apiData.url}${apiData.realPrice}?symbol=${symbol}&side=${side}`, {
        method: 'GET',

        headers: headers
    })
        .then(response => response.json())
        .then(data => {
            success = data.success;
            if (success) {
                result = data.result;
                console.log('RealTimePrice:', result.price);
            }


        })
        .catch(error => {
            console.error('Error:', error);

        });

    return { success: success, result: result };

}
async function getHistory(symbol, resolution, from, to) {
    let fromTimestamp = getTimestamp(from).toString();
    let toTimestamp = getTimestamp(to).toString();
    let obj;
    await fetch(`${apiData.url}${apiData.history}?symbol=${symbol}&resolution=${resolution}&from=${fromTimestamp}&to=${toTimestamp}`)

        .then(response => response.json())
        .then(data => {
            console.log('getHistory:', data);
            obj = data;
            //let closeHistory = exportClosePrice(data);
            //console.log('closeHistory[0]:', closeHistory[0]);
        })
        .catch(error => {
            console.error('getHistoryError:', error);

        });
    return obj;
}

function getTimestamp(myZoonDate) {
    // Create a new Date object with your desired date and time
    const date = new Date(myZoonDate);

    // Convert the date to a Unix timestamp (in milliseconds)
    const unixTimestamp = date.getTime() / 1000;

    return unixTimestamp;
}

function getIntArray(inputArray) {
    let resultIntArray = inputArray.map(num => parseInt(num));
    return resultIntArray;
}

function exportClosePrice(data) {
    let closePrice = data.c;
    let IntClosePrice = getIntArray(closePrice);
    return IntClosePrice;
}

class SmartPlot {
    constructor(idPlot, xvar, yvar, title) {
        this.idPlot = idPlot;
        this.dataplot = [
            { x: xvar, y: yvar, mode: "markers" }
        ];
        this.layout = {
            xaxis: { range: [-1, 1], title: "" },
            yaxis: { range: [-1, 1], title: "" },
            title: title
        };
    }


    plot() {
        Plotly.newPlot(this.idPlot, this.dataplot, this.layout);
    }

}

function sumArrays(arrays) {
    let result = [];

    for (let i = 0; i < arrays[0].length; i++) {
        let sum = 0;

        for (let j = 0; j < arrays.length; j++) {
            sum += arrays[j][i];
        }

        result.push(sum);
    }

    return result;
}

class ShSmartRebalanceTester {
    constructor(arrayMAPrices, windowStudy, initTotalInvestment, arrayInitInvest, arrayExchangeRate, maPeriod) {

        this.ArrayofMACoins = arrayMAPrices;
        this.NumberofCoins = this.ArrayofMACoins.length;
        this.LengthofData = this.ArrayofMACoins[0].length;
        this.windowStudy = windowStudy;
        this.initTotalInvestment = initTotalInvestment;
        this.arrayInitInvest = arrayInitInvest;
        this.arrayExchangeRate = arrayExchangeRate;
        this.maPeriod = maPeriod;
        this.resultMovingCorolation = MovingCorolation(maPeriod, arrayExchangeRate);
        this.ermc = ExportResultMovingCorolation(this.resultMovingCorolation);
        this.movCor_1 = this.ermc.movCor_1;
        this.movCor_2 = this.ermc.movCor_2;
        this.movCor_3 = this.ermc.movCor_3;

    }

    runSHrebalance_VilocityBase() {
        let testresult = [];
        //---
        let RESULT = [];
        let result_1 = [];
        let result_2 = [];
        let result_3 = [];
        //---
        let sliceHandler_1 = [];
        let sliceHandler_2 = [];
        let sliceHandler_3 = [];
        //---
        let normSliceHandler_1 = [];
        let normSliceHandler_2 = [];
        let normSliceHandler_3 = [];
        //---
        let VnormSliceHandler_1;
        let VnormSliceHandler_2;
        let VnormSliceHandler_3;
        //---
        let MemoryLastAction_1 = "sell";
        let MemoryLastAction_2 = "sell";
        let MemoryLastAction_3 = "sell";
        //---
        let Invest_1 = [];
        let Invest_2 = [];
        let Invest_3 = [];
        //---
        let Assets_1 = [];
        let Assets_2 = [];
        let Assets_3 = [];
        //---
        let Exchange_1 = this.arrayExchangeRate[0];
        let Exchange_2 = this.arrayExchangeRate[1];
        let Exchange_3 = this.arrayExchangeRate[2];
        //---
        let ActionList_1 = [];
        let ActionList_2 = [];
        let ActionList_3 = [];
        //---
        let minInvest_1 = this.arrayInitInvest[0];
        let minInvest_2 = this.arrayInitInvest[1];
        let minInvest_3 = this.arrayInitInvest[2];
        let minMemoryArray = [minInvest_1, minInvest_2, minInvest_3];
        let realInvevestArray = [];
        let sumOfMinInvest = minMemoryArray.reduce((acc, curr) => acc + curr, 0);
        let WorkingCapital = this.initTotalInvestment - sumOfMinInvest;
        let maxWorkingCapital = 0;

        for (var i = 0; i < this.windowStudy; i++) {

            //---
            Invest_1[i] = this.arrayInitInvest[0];
            Invest_2[i] = this.arrayInitInvest[1];
            Invest_3[i] = this.arrayInitInvest[2];
            //---
            realInvevestArray = [Invest_1[i], Invest_2[i], Invest_3[i]];
            minMemoryArray = shUpdateMinMemoryArray(minMemoryArray, realInvevestArray);
            sumOfMinInvest = minMemoryArray.reduce((acc, curr) => acc + curr, 0);
            WorkingCapital = this.initTotalInvestment - sumOfMinInvest;
            if (WorkingCapital > maxWorkingCapital) {
                maxWorkingCapital = WorkingCapital;
            }
            //---
            Assets_1[i] = 0;
            Assets_2[i] = 0;
            Assets_3[i] = 0;
            //---
            result_1[i] = Invest_1[i] + Assets_1[i] * Exchange_1[i + this.maPeriod - 1];
            result_2[i] = Invest_2[i] + Assets_2[i] * Exchange_2[i + this.maPeriod - 1];
            result_3[i] = Invest_3[i] + Assets_3[i] * Exchange_3[i + this.maPeriod - 1];
            RESULT[i] = result_1[i] + result_2[i] + result_3[i];
            //---
            ActionList_1[i] = "sell";
            ActionList_2[i] = "sell";
            ActionList_3[i] = "sell";

        }
        //--
        for (var i = this.windowStudy; i < this.LengthofData; i++) {
            //---
            sliceHandler_1 = this.ArrayofMACoins[0].slice(0, i);
            sliceHandler_2 = this.ArrayofMACoins[1].slice(0, i);
            sliceHandler_3 = this.ArrayofMACoins[2].slice(0, i);
            //---
            normSliceHandler_1 = NormalizeArray(sliceHandler_1);
            normSliceHandler_2 = NormalizeArray(sliceHandler_2);
            normSliceHandler_3 = NormalizeArray(sliceHandler_3);
            //---
            VnormSliceHandler_1 = normSliceHandler_1[i - 1] - normSliceHandler_1[i - 2];
            VnormSliceHandler_2 = normSliceHandler_2[i - 1] - normSliceHandler_2[i - 2];
            VnormSliceHandler_3 = normSliceHandler_3[i - 1] - normSliceHandler_3[i - 2];
            //---
            let realAction_1 = this.DecisionBaseVilocity(VnormSliceHandler_1, MemoryLastAction_1);
            let realAction_2 = this.DecisionBaseVilocity(VnormSliceHandler_2, MemoryLastAction_2);
            let realAction_3 = this.DecisionBaseVilocity(VnormSliceHandler_3, MemoryLastAction_3);
            //---
            MemoryLastAction_1 = this.UpdateMemoryLastAction(realAction_1, MemoryLastAction_1);
            MemoryLastAction_2 = this.UpdateMemoryLastAction(realAction_2, MemoryLastAction_2);
            MemoryLastAction_3 = this.UpdateMemoryLastAction(realAction_3, MemoryLastAction_3);
            //---
            ActionList_1[i] = MemoryLastAction_1;
            ActionList_2[i] = MemoryLastAction_2;
            ActionList_3[i] = MemoryLastAction_3;
            //---
            let realAssetsInvest_1 = this.RunAction(realAction_1, Invest_1[i - 1], Assets_1[i - 1], Exchange_1[i + this.maPeriod - 1]);
            let realAssetsInvest_2 = this.RunAction(realAction_2, Invest_2[i - 1], Assets_2[i - 1], Exchange_2[i + this.maPeriod - 1]);
            let realAssetsInvest_3 = this.RunAction(realAction_3, Invest_3[i - 1], Assets_3[i - 1], Exchange_3[i + this.maPeriod - 1]);
            //---
            Invest_1[i] = realAssetsInvest_1.realInvest;
            Invest_2[i] = realAssetsInvest_2.realInvest;
            Invest_3[i] = realAssetsInvest_3.realInvest;
            //---
            realInvevestArray = [Invest_1[i], Invest_2[i], Invest_3[i]];
            minMemoryArray = shUpdateMinMemoryArray(minMemoryArray, realInvevestArray);
            sumOfMinInvest = minMemoryArray.reduce((acc, curr) => acc + curr, 0);
            WorkingCapital = this.initTotalInvestment - sumOfMinInvest;
            if (WorkingCapital > maxWorkingCapital) {
                maxWorkingCapital = WorkingCapital;
            }
            //---
            Assets_1[i] = realAssetsInvest_1.realAssets;
            Assets_2[i] = realAssetsInvest_2.realAssets;
            Assets_3[i] = realAssetsInvest_3.realAssets;
            //---
            result_1[i] = Invest_1[i] + Assets_1[i] * Exchange_1[i + this.maPeriod - 1];
            result_2[i] = Invest_2[i] + Assets_2[i] * Exchange_2[i + this.maPeriod - 1];
            result_3[i] = Invest_3[i] + Assets_3[i] * Exchange_3[i + this.maPeriod - 1];
            RESULT[i] = result_1[i] + result_2[i] + result_3[i];


        }

        //testresult = [normSliceHandler_1, normSliceHandler_2, normSliceHandler_3];
        //let testresult_2 = [VnormSliceHandler_1, VnormSliceHandler_2, VnormSliceHandler_3];

        //return { testresult: testresult, testresult_2: testresult_2 };
        let resultActionList = [ActionList_1, ActionList_2, ActionList_3];
        let resultAssets = [Assets_1, Assets_2, Assets_3];
        let resultInvest = [Invest_1, Invest_2, Invest_3];
        return {
            RESULT: RESULT,
            resultActionList: resultActionList,
            resultAssets: resultAssets,
            resultInvest: resultInvest,
            maxWorkingCapital: maxWorkingCapital
        };
    }

    runSHrebalance_AcceleratBase() {
        let testresult = [];
        //---
        let RESULT = [];
        let result_1 = [];
        let result_2 = [];
        let result_3 = [];
        //---
        let sliceHandler_1 = [];
        let sliceHandler_2 = [];
        let sliceHandler_3 = [];
        //---
        let normSliceHandler_1 = [];
        let normSliceHandler_2 = [];
        let normSliceHandler_3 = [];
        //---
        let VnormSliceHandler_1;
        let VnormSliceHandler_2;
        let VnormSliceHandler_3;
        //---
        let AnormSliceHandler_1;
        let AnormSliceHandler_2;
        let AnormSliceHandler_3;
        //---
        let MemoryLastAction_1 = "sell";
        let MemoryLastAction_2 = "sell";
        let MemoryLastAction_3 = "sell";
        //---
        let Invest_1 = [];
        let Invest_2 = [];
        let Invest_3 = [];
        //---
        let Assets_1 = [];
        let Assets_2 = [];
        let Assets_3 = [];
        //---
        let Exchange_1 = this.arrayExchangeRate[0];
        let Exchange_2 = this.arrayExchangeRate[1];
        let Exchange_3 = this.arrayExchangeRate[2];
        //---
        let ActionList_1 = [];
        let ActionList_2 = [];
        let ActionList_3 = [];
        //---
        let minInvest_1 = this.arrayInitInvest[0];
        let minInvest_2 = this.arrayInitInvest[1];
        let minInvest_3 = this.arrayInitInvest[2];
        let minMemoryArray = [minInvest_1, minInvest_2, minInvest_3];
        let realInvevestArray = [];
        let sumOfMinInvest = minMemoryArray.reduce((acc, curr) => acc + curr, 0);
        let WorkingCapital = this.initTotalInvestment - sumOfMinInvest;
        let maxWorkingCapital = 0;

        for (var i = 0; i < this.windowStudy; i++) {

            //---
            Invest_1[i] = this.arrayInitInvest[0];
            Invest_2[i] = this.arrayInitInvest[1];
            Invest_3[i] = this.arrayInitInvest[2];
            //---
            realInvevestArray = [Invest_1[i], Invest_2[i], Invest_3[i]];
            minMemoryArray = shUpdateMinMemoryArray(minMemoryArray, realInvevestArray);
            sumOfMinInvest = minMemoryArray.reduce((acc, curr) => acc + curr, 0);
            WorkingCapital = this.initTotalInvestment - sumOfMinInvest;
            if (WorkingCapital > maxWorkingCapital) {
                maxWorkingCapital = WorkingCapital;
            }
            //---
            Assets_1[i] = 0;
            Assets_2[i] = 0;
            Assets_3[i] = 0;
            //---
            result_1[i] = Invest_1[i] + Assets_1[i] * Exchange_1[i + this.maPeriod - 1];
            result_2[i] = Invest_2[i] + Assets_2[i] * Exchange_2[i + this.maPeriod - 1];
            result_3[i] = Invest_3[i] + Assets_3[i] * Exchange_3[i + this.maPeriod - 1];
            RESULT[i] = result_1[i] + result_2[i] + result_3[i];
            //---
            ActionList_1[i] = "sell";
            ActionList_2[i] = "sell";
            ActionList_3[i] = "sell";

        }
        //--
        for (var i = this.windowStudy; i < this.LengthofData; i++) {
            //---
            sliceHandler_1 = this.ArrayofMACoins[0].slice(0, i);
            sliceHandler_2 = this.ArrayofMACoins[1].slice(0, i);
            sliceHandler_3 = this.ArrayofMACoins[2].slice(0, i);
            //---
            normSliceHandler_1 = NormalizeArray(sliceHandler_1);
            normSliceHandler_2 = NormalizeArray(sliceHandler_2);
            normSliceHandler_3 = NormalizeArray(sliceHandler_3);
            //---
            VnormSliceHandler_1 = normSliceHandler_1[i - 1] - normSliceHandler_1[i - 2];
            VnormSliceHandler_2 = normSliceHandler_2[i - 1] - normSliceHandler_2[i - 2];
            VnormSliceHandler_3 = normSliceHandler_3[i - 1] - normSliceHandler_3[i - 2];
            //---
            AnormSliceHandler_1 = normSliceHandler_1[i - 1] - 2 * normSliceHandler_1[i - 2] + normSliceHandler_1[i - 3];
            AnormSliceHandler_2 = normSliceHandler_2[i - 1] - 2 * normSliceHandler_2[i - 2] + normSliceHandler_2[i - 3];
            AnormSliceHandler_3 = normSliceHandler_3[i - 1] - 2 * normSliceHandler_3[i - 2] + normSliceHandler_3[i - 3];
            //---
            let realAction_1 = this.DecisionBaseAccelerate(AnormSliceHandler_1, VnormSliceHandler_1, MemoryLastAction_1);
            let realAction_2 = this.DecisionBaseAccelerate(AnormSliceHandler_2, VnormSliceHandler_2, MemoryLastAction_2);
            let realAction_3 = this.DecisionBaseAccelerate(AnormSliceHandler_3, VnormSliceHandler_3, MemoryLastAction_3);
            //---
            MemoryLastAction_1 = this.UpdateMemoryLastAction(realAction_1, MemoryLastAction_1);
            MemoryLastAction_2 = this.UpdateMemoryLastAction(realAction_2, MemoryLastAction_2);
            MemoryLastAction_3 = this.UpdateMemoryLastAction(realAction_3, MemoryLastAction_3);
            //---
            ActionList_1[i] = MemoryLastAction_1;
            ActionList_2[i] = MemoryLastAction_2;
            ActionList_3[i] = MemoryLastAction_3;
            //---
            let realAssetsInvest_1 = this.RunAction(realAction_1, Invest_1[i - 1], Assets_1[i - 1], Exchange_1[i + this.maPeriod - 1]);
            let realAssetsInvest_2 = this.RunAction(realAction_2, Invest_2[i - 1], Assets_2[i - 1], Exchange_2[i + this.maPeriod - 1]);
            let realAssetsInvest_3 = this.RunAction(realAction_3, Invest_3[i - 1], Assets_3[i - 1], Exchange_3[i + this.maPeriod - 1]);
            //---
            Invest_1[i] = realAssetsInvest_1.realInvest;
            Invest_2[i] = realAssetsInvest_2.realInvest;
            Invest_3[i] = realAssetsInvest_3.realInvest;
            //---
            realInvevestArray = [Invest_1[i], Invest_2[i], Invest_3[i]];
            minMemoryArray = shUpdateMinMemoryArray(minMemoryArray, realInvevestArray);
            sumOfMinInvest = minMemoryArray.reduce((acc, curr) => acc + curr, 0);
            WorkingCapital = this.initTotalInvestment - sumOfMinInvest;
            if (WorkingCapital > maxWorkingCapital) {
                maxWorkingCapital = WorkingCapital;
            }
            //---
            Assets_1[i] = realAssetsInvest_1.realAssets;
            Assets_2[i] = realAssetsInvest_2.realAssets;
            Assets_3[i] = realAssetsInvest_3.realAssets;
            //---
            result_1[i] = Invest_1[i] + Assets_1[i] * Exchange_1[i + this.maPeriod - 1];
            result_2[i] = Invest_2[i] + Assets_2[i] * Exchange_2[i + this.maPeriod - 1];
            result_3[i] = Invest_3[i] + Assets_3[i] * Exchange_3[i + this.maPeriod - 1];
            RESULT[i] = result_1[i] + result_2[i] + result_3[i];


        }

        //testresult = [normSliceHandler_1, normSliceHandler_2, normSliceHandler_3];
        //let testresult_2 = [VnormSliceHandler_1, VnormSliceHandler_2, VnormSliceHandler_3];

        //return { testresult: testresult, testresult_2: testresult_2 };
        let resultActionList = [ActionList_1, ActionList_2, ActionList_3];
        let resultAssets = [Assets_1, Assets_2, Assets_3];
        let resultInvest = [Invest_1, Invest_2, Invest_3];
        return {
            RESULT: RESULT,
            resultActionList: resultActionList,
            resultAssets: resultAssets,
            resultInvest: resultInvest,
            maxWorkingCapital: maxWorkingCapital
        };
    }

    runSHrebalance_AcceleratBase_Corolation() {
        let testresult = [];
        //---
        let RESULT = [];
        let result_1 = [];
        let result_2 = [];
        let result_3 = [];
        //---
        let sliceHandler_1 = [];
        let sliceHandler_2 = [];
        let sliceHandler_3 = [];
        //---
        let normSliceHandler_1 = [];
        let normSliceHandler_2 = [];
        let normSliceHandler_3 = [];
        //---
        let VnormSliceHandler_1;
        let VnormSliceHandler_2;
        let VnormSliceHandler_3;
        //---
        let AnormSliceHandler_1;
        let AnormSliceHandler_2;
        let AnormSliceHandler_3;
        //---
        let MemoryLastAction_1 = "sell";
        let MemoryLastAction_2 = "sell";
        let MemoryLastAction_3 = "sell";
        //---
        let Invest_1 = [];
        let Invest_2 = [];
        let Invest_3 = [];
        //---
        let Assets_1 = [];
        let Assets_2 = [];
        let Assets_3 = [];
        //---
        let Exchange_1 = this.arrayExchangeRate[0];
        let Exchange_2 = this.arrayExchangeRate[1];
        let Exchange_3 = this.arrayExchangeRate[2];
        //---
        let ActionList_1 = [];
        let ActionList_2 = [];
        let ActionList_3 = [];
        //---
        let TMNassets = [];
        let CorVarified = [];
        //---
        //---
        let minInvest_1 = this.arrayInitInvest[0];
        let minInvest_2 = this.arrayInitInvest[1];
        let minInvest_3 = this.arrayInitInvest[2];
        let minMemoryArray = [minInvest_1, minInvest_2, minInvest_3];
        let realInvevestArray = [];
        let sumOfMinInvest = minMemoryArray.reduce((acc, curr) => acc + curr, 0);
        let WorkingCapital = this.initTotalInvestment - sumOfMinInvest;
        let maxWorkingCapital = 0;
        //---

        for (var i = 0; i < this.windowStudy; i++) {

            //---
            Invest_1[i] = this.arrayInitInvest[0];
            Invest_2[i] = this.arrayInitInvest[1];
            Invest_3[i] = this.arrayInitInvest[2];
            TMNassets[i] = Invest_1[i] + Invest_2[i] + Invest_3[i];
            //---
            realInvevestArray = [Invest_1[i], Invest_2[i], Invest_3[i]];
            minMemoryArray = shUpdateMinMemoryArray(minMemoryArray, realInvevestArray);
            sumOfMinInvest = minMemoryArray.reduce((acc, curr) => acc + curr, 0);
            WorkingCapital = this.initTotalInvestment - sumOfMinInvest;
            if (WorkingCapital > maxWorkingCapital) {
                maxWorkingCapital = WorkingCapital;
            }
            //---
            Assets_1[i] = 0;
            Assets_2[i] = 0;
            Assets_3[i] = 0;
            //---
            result_1[i] = Invest_1[i] + Assets_1[i] * Exchange_1[i + this.maPeriod - 1];
            result_2[i] = Invest_2[i] + Assets_2[i] * Exchange_2[i + this.maPeriod - 1];
            result_3[i] = Invest_3[i] + Assets_3[i] * Exchange_3[i + this.maPeriod - 1];
            RESULT[i] = result_1[i] + result_2[i] + result_3[i];
            //---
            ActionList_1[i] = "sell";
            ActionList_2[i] = "sell";
            ActionList_3[i] = "sell";
            CorVarified[i] = "waitToStart";

        }
        //--
        for (var i = this.windowStudy; i < this.LengthofData; i++) {
            //---
            sliceHandler_1 = this.ArrayofMACoins[0].slice(0, i);
            sliceHandler_2 = this.ArrayofMACoins[1].slice(0, i);
            sliceHandler_3 = this.ArrayofMACoins[2].slice(0, i);
            //---
            normSliceHandler_1 = NormalizeArray(sliceHandler_1);
            normSliceHandler_2 = NormalizeArray(sliceHandler_2);
            normSliceHandler_3 = NormalizeArray(sliceHandler_3);
            //---
            VnormSliceHandler_1 = normSliceHandler_1[i - 1] - normSliceHandler_1[i - 2];
            VnormSliceHandler_2 = normSliceHandler_2[i - 1] - normSliceHandler_2[i - 2];
            VnormSliceHandler_3 = normSliceHandler_3[i - 1] - normSliceHandler_3[i - 2];
            //---
            AnormSliceHandler_1 = normSliceHandler_1[i - 1] - 2 * normSliceHandler_1[i - 2] + normSliceHandler_1[i - 3];
            AnormSliceHandler_2 = normSliceHandler_2[i - 1] - 2 * normSliceHandler_2[i - 2] + normSliceHandler_2[i - 3];
            AnormSliceHandler_3 = normSliceHandler_3[i - 1] - 2 * normSliceHandler_3[i - 2] + normSliceHandler_3[i - 3];
            //---
            let realAction_1 = this.DecisionBaseAccelerate(AnormSliceHandler_1, VnormSliceHandler_1, MemoryLastAction_1);
            let realAction_2 = this.DecisionBaseAccelerate(AnormSliceHandler_2, VnormSliceHandler_2, MemoryLastAction_2);
            let realAction_3 = this.DecisionBaseAccelerate(AnormSliceHandler_3, VnormSliceHandler_3, MemoryLastAction_3);
            //---
            MemoryLastAction_1 = this.UpdateMemoryLastAction(realAction_1, MemoryLastAction_1);
            MemoryLastAction_2 = this.UpdateMemoryLastAction(realAction_2, MemoryLastAction_2);
            MemoryLastAction_3 = this.UpdateMemoryLastAction(realAction_3, MemoryLastAction_3);
            //---
            ActionList_1[i] = MemoryLastAction_1;
            ActionList_2[i] = MemoryLastAction_2;
            ActionList_3[i] = MemoryLastAction_3;
            //---
            let corolationArray = [this.movCor_1[i], this.movCor_2[i], this.movCor_3[i]];

            let realActionArray = [realAction_1, realAction_2, realAction_3];

            let pastInvestArray = [Invest_1[i - 1], Invest_2[i - 1], Invest_3[i - 1]];

            let pastAssetsArray = [Assets_1[i - 1], Assets_2[i - 1], Assets_3[i - 1]];

            let realExchangeArray = [Exchange_1[i + this.maPeriod - 1], Exchange_2[i + this.maPeriod - 1], Exchange_3[i + this.maPeriod - 1]];

            let resultUpdateAsInvUseCor = this.UpdateInvestAssetsUseCorolation(pastInvestArray, pastAssetsArray, realExchangeArray,
                corolationArray, realActionArray);

            CorVarified[i] = resultUpdateAsInvUseCor.varified;
            let updatedPastAssets = resultUpdateAsInvUseCor.updatedPastAssetsArray;
            let updatedPastInvest = resultUpdateAsInvUseCor.updatedPastInvestArray;
            //--
            Assets_1[i - 1] = updatedPastAssets[0];
            Assets_2[i - 1] = updatedPastAssets[1];
            Assets_3[i - 1] = updatedPastAssets[2];
            //--
            Invest_1[i - 1] = updatedPastInvest[0];
            Invest_2[i - 1] = updatedPastInvest[1];
            Invest_3[i - 1] = updatedPastInvest[2];
            //---
            let realAssetsInvest_1 = this.RunAction(realAction_1, Invest_1[i - 1], Assets_1[i - 1], Exchange_1[i + this.maPeriod - 1]);
            let realAssetsInvest_2 = this.RunAction(realAction_2, Invest_2[i - 1], Assets_2[i - 1], Exchange_2[i + this.maPeriod - 1]);
            let realAssetsInvest_3 = this.RunAction(realAction_3, Invest_3[i - 1], Assets_3[i - 1], Exchange_3[i + this.maPeriod - 1]);
            //---
            Invest_1[i] = realAssetsInvest_1.realInvest;
            Invest_2[i] = realAssetsInvest_2.realInvest;
            Invest_3[i] = realAssetsInvest_3.realInvest;
            //---
            realInvevestArray = [Invest_1[i], Invest_2[i], Invest_3[i]];
            minMemoryArray = shUpdateMinMemoryArray(minMemoryArray, realInvevestArray);
            sumOfMinInvest = minMemoryArray.reduce((acc, curr) => acc + curr, 0);
            WorkingCapital = this.initTotalInvestment - sumOfMinInvest;
            if (WorkingCapital > maxWorkingCapital) {
                maxWorkingCapital = WorkingCapital;
            }
            //---
            Assets_1[i] = realAssetsInvest_1.realAssets;
            Assets_2[i] = realAssetsInvest_2.realAssets;
            Assets_3[i] = realAssetsInvest_3.realAssets;
            //---
            result_1[i] = Invest_1[i] + Assets_1[i] * Exchange_1[i + this.maPeriod - 1];
            result_2[i] = Invest_2[i] + Assets_2[i] * Exchange_2[i + this.maPeriod - 1];
            result_3[i] = Invest_3[i] + Assets_3[i] * Exchange_3[i + this.maPeriod - 1];
            RESULT[i] = result_1[i] + result_2[i] + result_3[i];


        }

        //testresult = [normSliceHandler_1, normSliceHandler_2, normSliceHandler_3];
        //let testresult_2 = [VnormSliceHandler_1, VnormSliceHandler_2, VnormSliceHandler_3];

        //return { testresult: testresult, testresult_2: testresult_2 };
        let resultActionList = [ActionList_1, ActionList_2, ActionList_3];
        let resultAssets = [Assets_1, Assets_2, Assets_3];
        let resultInvest = [Invest_1, Invest_2, Invest_3];
        let resultCorVarified = CorVarified;
        return {
            RESULT: RESULT,
            resultActionList: resultActionList,
            resultAssets: resultAssets,
            resultInvest: resultInvest,
            resultCorVarified: resultCorVarified,
            maxWorkingCapital: maxWorkingCapital
        };
    }

    DecisionBaseVilocity(vParam, MemoryLastAction) {
        let realTimeAction;
        //
        if (vParam > 0) {
            switch (MemoryLastAction) {
                case "sell":
                    realTimeAction = "buy";
                    break;
                case "buy":
                    realTimeAction = "hold";
                    break;
            }

        }
        //
        if (vParam < 0) {
            switch (MemoryLastAction) {
                case "sell":
                    realTimeAction = "hold";
                    break;
                case "buy":
                    realTimeAction = "sell";
                    break;
            }
        }
        //
        if (vParam = 0) {
            switch (MemoryLastAction) {
                case "sell":
                    realTimeAction = "buy";
                    break;
                case "buy":
                    realTimeAction = "sell";
                    break;
            }
        }
        //
        return realTimeAction;
    }

    DecisionBaseAccelerate(aParam, vParam, MemoryLastAction) {
        let realTimeAction;
        //
        if (vParam > 0) {

            switch (MemoryLastAction) {
                case "sell":
                    realTimeAction = "buy";
                    break;
                case "buy":
                    if (aParam > 0) {
                        realTimeAction = "buy";
                        break;
                    }
                    if (aParam < 0) {
                        realTimeAction = "sell";
                        break;
                    }
                    if (aParam == 0) {
                        realTimeAction = "hold";
                        break;
                    }

            }

        }
        //
        if (vParam < 0) {
            switch (MemoryLastAction) {
                case "sell":
                    if (aParam > 0) {
                        realTimeAction = "buy";
                        break;
                    }
                    if (aParam < 0) {
                        realTimeAction = "sell";
                        break;
                    }
                    if (aParam == 0) {
                        realTimeAction = "hold";
                        break;
                    }

                case "buy":
                    realTimeAction = "sell";
                    break;
            }
        }
        //
        if (vParam == 0) {
            switch (MemoryLastAction) {
                case "sell":
                    realTimeAction = "buy";
                    break;
                case "buy":
                    realTimeAction = "sell";
                    break;
            }
        }
        //
        return realTimeAction;
    }

    UpdateMemoryLastAction(realTimeAction, MemoryLastAction) {
        let MLA;
        switch (realTimeAction) {
            case "buy":
                MLA = "buy";
                break;
            case "sell":
                MLA = "sell";
                break;
            case "hold":
                switch (MemoryLastAction) {
                    case "buy":
                        MLA = "buy";
                        break;
                    case "sell":
                        MLA = "sell";
                        break;
                }
                break;
        }

        return MLA;
    }

    UpdateInvestAssetsUseCorolation(pastInvestArray, pastAssetsArray, realExcgangeArray, corolationArray,
        realActionArray) {

        let varified = "NotChecked";
        //--
        let pastAssetsUSDT = pastAssetsArray[0];
        let pastInvestUSDT = pastInvestArray[0];
        let realExchangeUSDT = realExcgangeArray[0];
        //--
        let pastAssetsBTC = pastAssetsArray[1];
        let pastInvestBTC = pastInvestArray[1];
        //let realExchangeBTC = realExcgangeArray[1];
        //--
        let pastAssetsETH = pastAssetsArray[2];
        let pastInvestETH = pastInvestArray[2];
        let realExchangeETH = realExcgangeArray[2];
        //-
        let updatedPastAssetsArray = [];
        let updatedPastInvestArray = [];
        //--
        let updatedOriginArray = [];
        let updatedDestinationArray = [];

        //---
        if (corolationArray[2] > 0.5 && realActionArray[1] == "sell") {

            if (corolationArray[1] < -0.5 && realActionArray[0] == "buy") {
                varified = "ETH-->USDT";
            }
        }
        //---
        if (corolationArray[2] > 0.5 && realActionArray[1] == "buy") {

            if (corolationArray[1] < -0.5 && realActionArray[0] == "sell") {
                varified = "USDT-->ETH"
            }
        }
        //---
        if (corolationArray[2] < -0.5 && realActionArray[1] == "sell") {

            if (corolationArray[1] > 0.5 && realActionArray[0] == "buy") {
                varified = "ETH-->USDT"
            }
        }
        //---
        if (corolationArray[2] < -0.5 && realActionArray[1] == "buy") {

            if (corolationArray[1] > 0.5 && realActionArray[0] == "sell") {
                varified = "USDT-->ETH"
            }
        }

        if (varified == "NotChecked") {
            updatedPastAssetsArray = pastAssetsArray;
            updatedPastInvestArray = pastInvestArray;
        } else {
            //Array = [Assets,Invest,Exchange];
            let originArray = [];
            let destinationArray = [];
            let updatedArray = [];
            switch (varified) {
                case "ETH-->USDT":
                    originArray = [pastAssetsETH, pastInvestETH, realExchangeETH];
                    destinationArray = [pastAssetsUSDT, pastInvestUSDT, realExchangeUSDT];

                    updatedArray = this.OriginToDestination(originArray, destinationArray);
                    updatedOriginArray = updatedArray.updatedOriginArray;
                    updatedDestinationArray = updatedArray.updatedDestinationArray;
                    //
                    pastAssetsUSDT = updatedDestinationArray[0];
                    pastInvestUSDT = updatedDestinationArray[1];
                    //
                    pastAssetsETH = updatedOriginArray[0];
                    pastInvestETH = updatedOriginArray[1];
                    break;

                case "USDT-->ETH":
                    originArray = [pastAssetsUSDT, pastInvestUSDT, realExchangeUSDT];
                    destinationArray = [pastAssetsETH, pastInvestETH, realExchangeETH];

                    updatedArray = this.OriginToDestination(originArray, destinationArray);
                    updatedOriginArray = updatedArray.updatedOriginArray;
                    updatedDestinationArray = updatedArray.updatedDestinationArray;
                    //
                    pastAssetsUSDT = updatedOriginArray[0];
                    pastInvestUSDT = updatedOriginArray[1];
                    //
                    pastAssetsETH = updatedDestinationArray[0];
                    pastInvestETH = updatedDestinationArray[1];
                    break;
            }
        }
        updatedPastAssetsArray = [pastAssetsUSDT, pastAssetsBTC, pastAssetsETH];
        updatedPastInvestArray = [pastInvestUSDT, pastInvestBTC, pastInvestETH];
        //
        return {
            varified: varified,
            updatedPastAssetsArray: updatedPastAssetsArray,
            updatedPastInvestArray: updatedPastInvestArray
        };
    }

    /**
      * Update Origin and Destination Coins.
      * @param {any} originArray
      * @param {any} destinationArray
      */
    OriginToDestination(originArray, destinationArray) {
        //Array = [Assets,Invest,Exchange];
        let updatedOriginArray = [];
        let updatedDestinationArray = [];
        //--
        let oAssets = originArray[0];
        let oInvest = originArray[1];
        let oExchange = originArray[2];
        //-
        let dAssets = destinationArray[0];
        let dInvest = destinationArray[1];
        let dExchange = destinationArray[2];
        //---
        let oInvestHandler = 0.5 * oAssets * oExchange;
        oAssets = 0.5 * oAssets;
        //oInvest = oInvest;
        dInvest = dInvest + oInvestHandler;
        let dAssetsHandler = 0.5 * dInvest / dExchange;
        dInvest = 0.5 * dInvest;
        dAssets = dAssets + dAssetsHandler;
        //---
        updatedDestinationArray = [dAssets, dInvest, dExchange];
        updatedOriginArray = [oAssets, oInvest, oExchange];

        return {
            updatedDestinationArray: updatedDestinationArray,
            updatedOriginArray: updatedOriginArray
        }
    }
    /**
     * Return RealTime Action.
     * @param {any} RealAction
     * @param {any} pastInvest
     * @param {any} pastAssets
     * @param {any} realExchg
     */
    RunAction(RealAction, pastInvest, pastAssets, realExchg) {
        let realInvest;
        let realAssets;
        switch (RealAction) {
            case "hold":
                realInvest = pastInvest;
                realAssets = pastAssets;
                break;
            //---
            case "buy":
                realInvest = 0.5 * pastInvest;
                realAssets = 0.5 * pastInvest / realExchg + pastAssets;
                break;
            //---
            case "sell":
                realInvest = 0.5 * pastAssets * realExchg + pastInvest;
                realAssets = 0.5 * pastAssets;
                break;
        }

        return { realAssets: realAssets, realInvest: realInvest }
    }

}

class ManageInitInvest {
    constructor(initTotalInvestment, distributionRatioArray) {
        this.initTotalInvestment = initTotalInvestment;
        this.distributionRatioArray = distributionRatioArray;
        this.numberOfCoins = this.distributionRatioArray.length;
        this.DisturbedArray = this.getDisturbRatio();
    }

    getDisturbRatio() {

        return valuePerSumRatioArray(this.distributionRatioArray).resultArray;

    }

}

class SHBasket {
    constructor(arrayInvestment, arrayExchangeRate, arrayAssets, arrayAction, arrayMemory) {
        this.arrayInvestment = arrayInvestment;
        this.arrayExchangeRate = arrayExchangeRate;
        this.arrayAssets = arrayAssets;
        this.arrayAction = arrayAction;
        this.arrayMemory = arrayMemory;
        this.TotalInvestment = 0;
        this.arrayBasketPercentage = [];
    }

    getTotalInvestment() {
        const sum = this.arrayInvestment.reduce((acc, curr) => acc + curr, 0);
        return sum;
    }

    getBasketPercentage() {
        const percen = [];
        for (var i = 0; i < this.arrayInvestment.length; i++) {
            percen[i] = this.arrayInvestment[i] / this.TotalInvestment;
        }

        return percen;
    }

    getInvestment() {
        const investment = [];
        for (var i = 0; i < this.arrayExchangeRate.length; i++) {
            if (this.arrayAssets[i] != 0) {
                investment[i] = this.arrayInvestment[i] + (this.arrayExchangeRate[i] * this.arrayAssets[i]);
            } else {
                investment[i] = this.arrayInvestment[i];
            }

        }

        return investment;
    }

    getInvestmentUsingTotalInvestment() {
        const investment = [];
        for (var i = 0; i < this.arrayBasketPercentage.length; i++) {
            investment[i] = this.arrayBasketPercentage[i] * this.TotalInvestment;
        }

        return investment;
    }

    getAssets() {
        const assets = [];
        for (var i = 0; i < this.arrayExchangeRate.length; i++) {
            assets[i] = this.arrayInvestment[i] / this.arrayExchangeRate[i];
        }

        return assets;
    }
}
/**
 * 
 * @param {number[]} minMemoryArray
 * @param {number[]} realArray
 */
function shUpdateMinMemoryArray(minMemoryArray, realArray) {
    let updatedMinMemoryArray = [];
    let arrayLen = minMemoryArray.length;

    for (let i = 0; i < arrayLen; i++) {
        if (realArray[i] < minMemoryArray[i]) {
            updatedMinMemoryArray[i] = realArray[i];
        } else {
            updatedMinMemoryArray[i] = minMemoryArray[i];
        }
    }

    return updatedMinMemoryArray;
}

function NormalizeArray(inputArray) {
    let max = Math.max(...inputArray);
    let min = Math.min(...inputArray);

    return inputArray.map(normalize(min, max));
}

function normalize(min, max) {
    var delta = max - min;
    return function (val) {
        return (val - min) / delta;
    };
}

function calculateCovariance(arr1, arr2) {
    const mean1 = arr1.reduce((a, b) => a + b, 0) / arr1.length;
    const mean2 = arr2.reduce((a, b) => a + b, 0) / arr2.length;

    let covariance = 0;
    for (let i = 0; i < arr1.length; i++) {
        covariance += (arr1[i] - mean1) * (arr2[i] - mean2);
    }

    return covariance / (arr1.length - 1);
}

function combine(arr, k) {
    var res = [];

    function backtrack(start, curr) {
        if (curr.length === k) {
            res.push(curr.slice());
            return;
        }

        for (var i = start; i < arr.length; i++) {
            curr.push(arr[i]);
            backtrack(i + 1, curr);
            curr.pop();
        }
    }

    backtrack(0, []);
    return res;
}
/**
 * 
 * @param {any} inputArray
 */
function valuePerSumRatioArray(inputArray) {
    let sum = 0;
    let inputIntArray = getIntArray(inputArray);
    for (let v of inputIntArray) {
        sum += v;
    }

    let resultArray = [];
    for (let i = 0; i < inputIntArray.length; i++) {
        resultArray[i] = inputIntArray[i] / sum;
    }

    return resultArray;
}
/**
 * 
 * @param {any[]} ratioArray
 * @param {any} initTotalInvest
 */
function shGetInitInvestArray(ratioArray, initTotalInvest) {
    let percentageArray = valuePerSumRatioArray(ratioArray);
    let resultInitInvestArray = [];

    for (let i = 0; i < percentageArray.length; i++) {
        resultInitInvestArray[i] = percentageArray[i] * initTotalInvest;
    }

    return resultInitInvestArray;
}


//var arr = ["USDT", "BTC", "ETH", "SHIB"];
//var k = 2;

//var result = combine(arr, k);
//console.log("combine:",result);

function PearsonSampleCorrelationCoefficient(x, y) {
    var sumX = 0;
    var sumY = 0;
    var sumX2 = 0;
    var sumY2 = 0;
    var sumXY = 0;

    for (var i = 0; i < x.length; i++) {
        sumX += x[i];
        sumY += y[i];
        sumX2 += x[i] * x[i];
        sumY2 += y[i] * y[i];
        sumXY += x[i] * y[i];
    }

    var n = x.length;
    var numerator = (n * sumXY) - (sumX * sumY);
    var denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) {
        return 0;
    }

    return numerator / denominator;
}

function MovingCorolation(windowSample, arrayCoins) {
    let res = [];
    let arrayIndex = [];
    let arraySliceCoins = [];
    for (let i = 0; i < arrayCoins.length; i++) {
        arrayIndex[i] = i;
    }

    let combineIndex = combine(arrayIndex, 2);

    for (let i = 0; i < arrayCoins[0].length - windowSample + 1; i++) {
        for (let j = 0; j < arrayCoins.length; j++) {
            arraySliceCoins[j] = arrayCoins[j].slice(i, i + windowSample);
        }

        let sampleCorolationCoffitiont = [];
        for (let k = 0; k < combineIndex.length; k++) {
            let pairCoinsIndex = [];
            pairCoinsIndex = combineIndex[k];
            //console.log("pairCoinsIndex:", pairCoinsIndex);

            let arrayIndex_1 = pairCoinsIndex[0];
            let arrayIndex_2 = pairCoinsIndex[1];
            //covArray[i] = calculateCovariance(arrayCoins[arrayIndex_1], arrayCoins[arrayIndex_2]);
            //console.log(`covArray[${i}] : ${covArray[i]}`);

            sampleCorolationCoffitiont[k] = PearsonSampleCorrelationCoefficient(arraySliceCoins[arrayIndex_1], arraySliceCoins[arrayIndex_2]);

            //console.log(`sampleCorolationCoffitiont[${k}] : ${sampleCorolationCoffitiont[k]}`);


        }
        res[i] = sampleCorolationCoffitiont;
    }

    return res;
}

function ExportResultMovingCorolation(resultMovingCorolation) {
    let xValueToPlot = Array.from(Array(resultMovingCorolation.length), (_, i) => i + 1);
    let movCor_1 = [];
    let movCor_2 = [];
    let movCor_3 = [];
    for (let i = 0; i < resultMovingCorolation.length; i++) {
        let movBuff = resultMovingCorolation[i];
        movCor_1[i] = movBuff[0];
        movCor_2[i] = movBuff[1];
        movCor_3[i] = movBuff[2];
    }

    return { xValueToPlot: xValueToPlot, movCor_1: movCor_1, movCor_2: movCor_2, movCor_3: movCor_3 }
}

/**
   * Back to top button
   */
// Get the button
let mybutton = document.getElementById("backToTopBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
/**
 * return an Objet that keys equal to each input id attrbute and it's values.
 * @param {string} classname
 */
function shGetObjectFromClassName(classname) {
    const resultObject = new Object();
    let getClassFromDOM = document.getElementsByClassName(classname);

    for (let i = 0; i < getClassFromDOM.length; i++) {
        let pro = getClassFromDOM[i].id;
        let val = $("#" + pro).val();
        resultObject[pro] = val;
    }
    //console.log("getClassFromDOM:", getClassFromDOM);
    //console.log("resultObject:", resultObject);

    //for (const [key, value] of Object.entries(resultObject)) {
    //    console.log(`${key}: ${value}`);
    //}

    return resultObject;
}


class shArgTools {
    /**
     * 
     * @param {...any} inputArg
     */
    constructor(...inputArg) {
        this.inputArg = inputArg;
    }
    /** */
    ConsolLogArg() {

        //console.log("manyMoreArgs", manyMoreArgs);
        for (let i = 0; i < this.inputArg.length; i++) {
            let subArg = this.inputArg[i];
            console.log(`subArg[${i}]: ${subArg}`);
        }

    }
}
/**
 * 
 * @param {number[]} priceArray
 */
function TEPIXindex(priceArray) {
    let initPrice = priceArray[0];
    let resultArray = [];

    for (let i = 0; i < priceArray.length; i++) {
        resultArray[i] = priceArray[i] / initPrice;
    }

    return resultArray;
}
/**
 * 
 * @param {...number[]} argArrays
 */
function TEPIX_MARKET_INDEX(...argArrays) {
    let argLength = argArrays.length;
    let resultArrayLength = argArrays[0].length;
    let resultArray = [];

    for (let i = 0; i < resultArrayLength; i++) {
        let sum = 0;
        for (let j = 0; j < argLength; j++) {
            sum = sum + argArrays[j][i];
        }
        resultArray[i] = sum / argLength;
    }

    return resultArray;
}
/**
 * */
class SymbolStudy {
    /**
     * 
     * @param {string} symbolName
     * @param {string} resolotionStudy
     * @param {string} toDate
     * @param {string} fromDate
     */
    constructor(symbolName, resolotionStudy, fromDate, toDate) {
        this.symbolName = symbolName;
        this.resolotionStudy = resolotionStudy;
        this.toDate = toDate;
        this.fromDate = fromDate;
        this.History = this.getHistory();
        //this.TepixIndex = this.getTepixIndex();

    }

    async getHistory() {
        try {
            const response = await fetch(`${apiData.url}${apiData.history}?symbol=${this.symbolName}&resolution=${this.resolotionStudy}&from=${this.fromDate}&to=${this.toDate}`);
            const resultJson = await response.json();
            const history = exportClosePrice(resultJson);
            return history;
        }
        catch (err) {
            consol.log("SymbolStudy. getHistory() Error:", err);
        }
        
    }

    

    //getTepixIndex() {
    //    let initPrice = this.History[0];
    //    let resultArray = [];

    //    for (let i = 0; i < this.History.length; i++) {
    //        resultArray[i] = this.History[i] / initPrice;
    //    }

    //    return resultArray;
    //}
}
/**
 * 
 * @param {string} canvasID
 * @param {any} chartOBJ
 */
function Plot3Chart(canvasID, chartOBJ) {
    let lableArray = Object.values(chartOBJ.ChartLabels);
    let valuesArray = Object.values(chartOBJ.ChartValues);

    new Chart(canvasID, {
        type: "line",
        data: {
            labels: valuesArray[0],
            datasets: [
                {
                    data: valuesArray[1],
                    borderColor: "red",
                    fill: false,
                    label: lableArray[0]
                }, {
                    data: valuesArray[2],
                    borderColor: "black",
                    fill: false,
                    label: lableArray[1]
                }, {
                    data: valuesArray[3],
                    borderColor: "blue",
                    fill: false,
                    label: lableArray[2]
                }

            ]
        },
        options: {
            legend: { display: true }
        }
    });
}
/**
 * 
 * @param {any} coinsOBJ
 * @param {string} resolotion
 * @param {string} fromTimestamp
 * @param {string} toTimestamp
 * @param {string} canvasID
 */
function sh_runTepix3Coins(coinsOBJ, resolotion, fromTimestamp, toTimestamp,canvasID) {
    let coinsName = Object.keys(coinsOBJ);
    let coinsPair = Object.values(coinsOBJ);

    let coinsName_0 = new SymbolStudy(coinsPair[0], resolotion, fromTimestamp, toTimestamp);
    let history_0 = coinsName_0.History;

    let coinsName_1 = new SymbolStudy(coinsPair[1], resolotion, fromTimestamp, toTimestamp);
    let history_1 = coinsName_1.History;

    let coinsName_2 = new SymbolStudy(coinsPair[2], resolotion, fromTimestamp, toTimestamp);
    let history_2= coinsName_2.History;

    Promise.all([history_0, history_1, history_2, canvasID]).then(values => {
        let xvalue = Array.from(Array(values[0].length), (_, i) => i + 1);
        let tepixIndex_0 = TEPIXindex(values[0]);
        let tepixIndex_1 = TEPIXindex(values[1]);
        let tepixIndex_2 = TEPIXindex(values[2]);

        let chartOBJ = {
            ChartValues: {
                xValue: xvalue,
                tepix_0: tepixIndex_0,
                tepix_1: tepixIndex_1,
                tepix_2: tepixIndex_2
            },

            ChartLabels: {
                label_0: coinsName[0],
                label_1: coinsName[1],
                label_2: coinsName[2]
            }
            
        };

        let canvasID = values[3];

        Plot3Chart(canvasID, chartOBJ);

    });
}