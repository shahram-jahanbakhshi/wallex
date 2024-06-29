$(document).ready(function () {
    let wallexSmartCoinsArray = ["USDTTMN", "BTCTMN", "ETHTMN", "ADATMN", "BNBTMN", "DOGETMN", "FTMTMN", "LTCTMN", "MATICTMN",
        "PEPETMN", "SHIBTMN", "SOLTMN", "TRXTMN", "XRPTMN"];

    //-- test functions



    class SymbolDetales {
        constructor(Investment, Exchange_rate, Assets) {
            this.Investment = Investment;
            this.Exchange_rate = Exchange_rate;
            this.Assets = Assets;


        }
        getAssets() {

            return this.Investment / this.Exchange_rate;
        }

        getInvestment() {
            return this.Exchange_rate * this.Assets;
        }
    }

    class Basket {
        constructor(arrayInvestment, arrayExchangeRate, arrayAssets) {
            this.arrayInvestment = arrayInvestment;
            this.arrayExchangeRate = arrayExchangeRate;
            this.arrayAssets = arrayAssets;
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
                investment[i] = this.arrayExchangeRate[i] * this.arrayAssets[i];
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


    let gXValueforPlotMA = [];
    let gXValueforPlotVMA = [];
    let gNormMAusdt = [];
    let gNormMAbtc = [];
    let gNormMAeth = [];

    let gVMAusdt = [];
    let gVMAbtc = [];
    let gVMAeth = [];

    let gXSlice = [];
    let gSliceNormMAusdt = [];
    let gSliceNormMAbtc = [];
    let gSliceNormMAeth = [];

    let gNormVMAusdt = [];
    let gNormVMAbtc = [];
    let gNormVMAeth = [];

    let historyUSDT = [];
    let historyBTC = [];
    let historyETH = [];

    let tepix_USDT = [];
    let tepix_BTC = [];
    let tepix_ETH = [];

    let maUSTD;
    let maBTC;
    let maETH;

    let selectedSlice = 300;

    let from = $("#from").val();
    let to = $("#to").val();

    let fromTimestamp = getTimestamp(from).toString();
    let toTimestamp = getTimestamp(to).toString();

    $("#from").on("change", function () {

        from = $("#from").val();
        fromTimestamp = getTimestamp(from).toString();
        //console.log(`fromTimestamp: ${fromTimestamp}`);
    });

    $("#to").on("change", function () {
        to = $("#to").val();
        toTimestamp = getTimestamp(to).toString();
        //console.log("toTimestamp:", toTimestamp);
    });

    let basketRatios = shGetObjectFromClassName("ratio");
    //console.log("basketRatios:", basketRatios);
    let valuesRatio = Object.values(basketRatios);
    //console.log("valuesRatio:", valuesRatio);
    //---
    let initInvestTotal = $("#inToInv").val();
    $("#inToInv").on("change", function () {
        initInvestTotal = $("#inToInv").val();
    });


    //---
    $(".ratio").on("change", function () {
        basketRatios = shGetObjectFromClassName("ratio");
        //console.log("basketRatios:", basketRatios);
        valuesRatio = Object.values(basketRatios);
        //console.log("valuesRatio:", valuesRatio);

    })

    $("#getHistory_1").on("click", function () {

        fetch(`${apiData.url}${apiData.history}?symbol=USDTTMN&resolution=1D&from=${fromTimestamp}&to=${toTimestamp}`)

            .then(response => response.json())
            .then(data => {
                //console.log('history:', data);
                historyUSDT = exportClosePrice(data);
                tepix_USDT = TEPIXindex(historyUSDT);
                //console.log('historyUSDT:', historyUSDT);
                //let xvalue = Array.from(Array(historyUSDT.length), (_, i) => i + 1);

                //console.log("firstArray:", firstArray);
                maUSTD = MA(7, historyUSDT);
                gXValueforPlotMA = Array.from(Array(maUSTD.ma.length), (_, i) => i + 1);
                let normMAusdt = NormalizeArray(maUSTD.ma);
                gNormMAusdt = normMAusdt;
                //---Slice Study
                let sliceMAusdt = maUSTD.ma.slice(0, selectedSlice);
                gXSlice = Array.from(Array(sliceMAusdt.length), (_, i) => i + 1);
                let normSliceUSDT = NormalizeArray(sliceMAusdt);
                gSliceNormMAusdt = normSliceUSDT;
                //console.log("normSliceUSDT:", normSliceUSDT);
                //-------------------------------------------
                let Vma = VilocityMA(maUSTD.ma, historyUSDT.length);
                gVMAusdt = Vma;
                //let Ama = AccelerateMA(maUSTD.ma, historyUSDT.length);
                //let plotVAarray = ReadyVmaAmatoPlot(Vma, Ama, 7);
                //let Vprice = VilocityMA(historyUSDT, historyUSDT.length);
                let normVma = NormalizeArray(Vma);
                gNormVMAusdt = normVma;

                gXValueforPlotVMA = Array.from(Array(Vma.length), (_, i) => i + 1);
                //let normAma = NormalizeArray(Ama);
                //let VAma = ViloAccMA(plotVAarray.selectedAma, historyUSDT.length);

                //let SDVma = calculateStandardDeviation(Vma);
                //let SDAma = calculateStandardDeviation(Ama);
                //let SDVAms = calculateStandardDeviation(VAma);


                //console.log("normMAusdt: ", normMAusdt);

                //console.log("maUSTD:",maUSTD.result);
                //console.log("Vma:", Vma);
                //console.log("Ama:", Ama);
                //console.log("plotVAarray:", plotVAarray);
                //console.log("Vprice:", Vprice);
                //console.log("normVma:", normVma);
                //console.log("normAma:", normAma);
                //console.log("VAma: ", VAma);
                //console.log("SDVma:", SDVma);
                //console.log("SDAma:", SDAma);
                //console.log("SDVAms:", SDVAms);

                //plotUSDT(xvalue, historyUSDT, maUSTD.result);
                //var Vmaplot = new SmartPlot("VmaChart", xvalue, Vma, "Vma vs. time");
                //Vmaplot.plot();

                ////plotVma(xvalue, Vma);
                //plotAma(xvalue, Ama);
                //plotVAma(xvalue, VAma);

                ////plotVprice(xvalue, Vprice);
                //var VAmaplot = new SmartPlot("PlotVAma", plotVAarray.selectedVma, plotVAarray.selectedAma, "Ama vs. Vma");
                //VAmaplot.plot();

                //var VAmaNorm = new SmartPlot("PlotVAmaNorm", normVma, normAma, "Norm Ama vs. Vma");
                //VAmaNorm.plot();
                Swal.fire({
                    text: "اطلاعات دریافت شد",
                    icon: "success",
                    timer: 1000
                });
            })
            .catch(error => {
                console.error('Error:', error);

            });

    });

    $("#getHistory_2").on("click", function () {

        fetch(`${apiData.url}${apiData.history}?symbol=BTCTMN&resolution=1D&from=${fromTimestamp}&to=${toTimestamp}`)

            .then(response => response.json())
            .then(data => {
                //console.log('history:', data);
                historyBTC = exportClosePrice(data);
                tepix_BTC = TEPIXindex(historyBTC);
                //console.log('historyBTC:', historyBTC);
                //let xvalue = Array.from(Array(historyBTC.length), (_, i) => i + 1);
                maBTC = MA(7, historyBTC);
                var normMAbtc = NormalizeArray(maBTC.ma);
                gNormMAbtc = normMAbtc;
                //---Slice Study
                let sliceMAbtc = maBTC.ma.slice(0, selectedSlice);
                let normSliceBTC = NormalizeArray(sliceMAbtc);
                gSliceNormMAbtc = normSliceBTC;
                //-------------------------------------------
                let Vma = VilocityMA(maBTC.ma, historyBTC.length);
                gVMAbtc = Vma;
                //let Ama = AccelerateMA(maBTC.ma, historyBTC.length);
                //let plotVAarray = ReadyVmaAmatoPlot(Vma, Ama, 7);
                //let Vprice = VilocityMA(historyBTC, historyBTC.length);
                let normVma = NormalizeArray(Vma);
                gNormVMAbtc = normVma;
                //let normAma = NormalizeArray(Ama);
                //let VAma = ViloAccMA(plotVAarray.selectedAma, historyBTC.length);

                //let SDVma = calculateStandardDeviation(Vma);
                //let SDAma = calculateStandardDeviation(Ama);
                //let SDVAms = calculateStandardDeviation(VAma);


                //console.log("normMAbtc: ", normMAbtc);

                //console.log("maUSTD:",maUSTD.result);
                //console.log("Vma:", Vma);
                //console.log("Ama:", Ama);
                //console.log("plotVAarray:", plotVAarray);
                //console.log("Vprice:", Vprice);
                //console.log("normVma:", normVma);
                //console.log("normAma:", normAma);
                //console.log("VAma: ", VAma);
                //console.log("SDVma:", SDVma);
                //console.log("SDAma:", SDAma);
                //console.log("SDVAms:", SDVAms);

                //plotUSDT(xvalue, historyBTC, maBTC.result);
                //var Vmaplot = new SmartPlot("VmaChart", xvalue, Vma, "Vma vs. time");
                //Vmaplot.plot();

                ////plotVma(xvalue, Vma);
                //plotAma(xvalue, Ama);
                //plotVAma(xvalue, VAma);

                ////plotVprice(xvalue, Vprice);
                //var VAmaplot = new SmartPlot("PlotVAma", plotVAarray.selectedVma, plotVAarray.selectedAma, "Ama vs. Vma");
                //VAmaplot.plot();

                //var VAmaNorm = new SmartPlot("PlotVAmaNorm", normVma, normAma, "Norm Ama vs. Vma");
                //VAmaNorm.plot();
                Swal.fire({
                    text: "اطلاعات دریافت شد",
                    icon: "success",
                    timer: 1000
                });
            })
            .catch(error => {
                console.error('Error:', error);

            });

    });

    $("#getHistory_3").on("click", function () {

        fetch(`${apiData.url}${apiData.history}?symbol=ETHTMN&resolution=1D&from=${fromTimestamp}&to=${toTimestamp}`)

            .then(response => response.json())
            .then(data => {
                //console.log('history:', data);
                historyETH = exportClosePrice(data);
                tepix_ETH = TEPIXindex(historyETH);
                //console.log('historyETH:', historyETH);
                //var xvalue = Array.from(Array(historyETH.length), (_, i) => i + 1);
                maETH = MA(7, historyETH);
                var normMAeth = NormalizeArray(maETH.ma);
                gNormMAeth = normMAeth;
                //---Slice Study
                let sliceMAeth = maETH.ma.slice(0, selectedSlice);
                let normSliceETH = NormalizeArray(sliceMAeth);
                gSliceNormMAeth = normSliceETH;
                //-------------------------------------------
                let Vma = VilocityMA(maETH.ma, historyETH.length);
                gVMAeth = Vma;
                //let Ama = AccelerateMA(maETH.ma, historyETH.length);
                //let plotVAarray = ReadyVmaAmatoPlot(Vma, Ama, 7);
                //let Vprice = VilocityMA(historyETH, historyETH.length);
                let normVma = NormalizeArray(Vma);
                gNormVMAeth = normVma;
                //let normAma = NormalizeArray(Ama);
                //let VAma = ViloAccMA(plotVAarray.selectedAma, historyETH.length);

                //let SDVma = calculateStandardDeviation(Vma);
                //let SDAma = calculateStandardDeviation(Ama);
                //let SDVAms = calculateStandardDeviation(VAma);


                //console.log("normMAeth: ", normMAeth);

                //console.log("maUSTD:",maUSTD.result);
                //console.log("Vma:", Vma);
                //console.log("Ama:", Ama);
                //console.log("plotVAarray:", plotVAarray);
                //console.log("Vprice:", Vprice);
                //console.log("normVma:", normVma);
                //console.log("normAma:", normAma);
                //console.log("VAma: ", VAma);
                //console.log("SDVma:", SDVma);
                //console.log("SDAma:", SDAma);
                //console.log("SDVAms:", SDVAms);

                //plotUSDT(xvalue, historyETH, maETH.result);
                //var Vmaplot = new SmartPlot("VmaChart", xvalue, Vma, "Vma vs. time");
                //Vmaplot.plot();

                ////plotVma(xvalue, Vma);
                //plotAma(xvalue, Ama);
                //plotVAma(xvalue, VAma);

                ////plotVprice(xvalue, Vprice);
                //var VAmaplot = new SmartPlot("PlotVAma", plotVAarray.selectedVma, plotVAarray.selectedAma, "Ama vs. Vma");
                //VAmaplot.plot();

                //var VAmaNorm = new SmartPlot("PlotVAmaNorm", normVma, normAma, "Norm Ama vs. Vma");
                //VAmaNorm.plot();
                Swal.fire({
                    text: "اطلاعات دریافت شد",
                    icon: "success",
                    timer: 1000
                });
            })
            .catch(error => {
                console.error('Error:', error);

            });

    });

    let xValue = [];
    let resultSmartRebalance = [];
    let tepix_SmartRebalance = [];
    let tepix_Market = [];

    $("#startRebalance").on("click", function () {

        let results = SmartRebalance(initInvestTotal, valuesRatio, historyUSDT, historyBTC, historyETH);
        xValue = results.xValue;
        resultSmartRebalance = results.resultSmartRebalance;
        tepix_SmartRebalance = TEPIXindex(resultSmartRebalance);
        tepix_Market = TEPIX_MARKET_INDEX(tepix_USDT, tepix_BTC, tepix_ETH);

        Swal.fire({
            text: "عملیات موفق",
            icon: "success",
            timer: 1000
        });
    });

    $("#plot3NormMA").on("click", function () {
        //console.log("gXValueforPlotMA:", gXValueforPlotMA);
        //console.log("gNormMAusdt:", gNormMAusdt);
        //console.log("gNormMAbtc:", gNormMAbtc);
        //console.log("gNormMAeth:", gNormMAeth);
        plot3NormMA(gXValueforPlotMA, gNormMAusdt, gNormMAbtc, gNormMAeth);
        plot3SliceNormMA(gXSlice, gSliceNormMAusdt, gSliceNormMAbtc, gSliceNormMAeth);

    });

    $("#plot3VMA").on("click", function () {

        plot3VMA(gXValueforPlotVMA, gVMAusdt, gVMAbtc, gVMAeth);
    });

    $("#plot3NormVMA").on("click", function () {
        plot3NormVMA(gXValueforPlotVMA, gNormVMAusdt, gNormVMAbtc, gNormVMAeth);
        Swal.fire({
            text: "عملیات موفق",
            icon: "success",
            timer: 1000
        });
    });

    let resultSHRebalance_V = [];
    let resultSHRebalance_A = [];
    let resultSHRebalance_A_C = [];

    $("#ShRebalance_VilocityBase").on("click", function () {
        //let sliceMAusdt = maUSTD.ma.slice(0, selectedSlice + 1);
        //let sliceMAbtc = maBTC.ma.slice(0, selectedSlice + 1);
        //let sliceMAeth = maETH.ma.slice(0, selectedSlice + 1);

        let arrayCoins = [maUSTD.ma, maBTC.ma, maETH.ma];
        let windowstudy = 10;
        let initinvestment = 30000000;
        let arrayInitInvest = [10000000, 10000000, 10000000];
        let arrayExchangRate = [historyUSDT, historyBTC, historyETH];
        let shSmart = new ShSmartRebalanceTester(arrayCoins, windowstudy, initinvestment, arrayInitInvest, arrayExchangRate, 7);
        //console.log("shSmart.NumberofCoins:", shSmart.NumberofCoins);
        //console.log("shSmart.LengthofData:", shSmart.LengthofData);
        //console.log("shSmart.ArrayofCoins[0]:",shSmart.ArrayofCoins[0]);

        const resArray = new Array(6).fill(initinvestment);
        let result = shSmart.runSHrebalance_VilocityBase();
        resultSHRebalance_V = resArray.concat(result.RESULT);
        let maxWorkingCapital = result.maxWorkingCapital;
        console.log(`maxWorkingCapital in VBase_sim: ${maxWorkingCapital}`);
        //console.log("resultSHRebalance:", resultSHRebalance);
        //---------------------------------------------
        //--- success alert
        Swal.fire({
            text: "اطلاعات دریافت شد",
            icon: "success",
            timer: 1000
        });
    });

    $("#ShRebalance_AcceleratBase").on("click", function () {
        //let sliceMAusdt = maUSTD.ma.slice(0, selectedSlice + 1);
        //let sliceMAbtc = maBTC.ma.slice(0, selectedSlice + 1);
        //let sliceMAeth = maETH.ma.slice(0, selectedSlice + 1);

        let arrayCoins = [maUSTD.ma, maBTC.ma, maETH.ma];
        let windowstudy = 10;
        let initinvestment = 30000000;
        let arrayInitInvest = [10000000, 10000000, 10000000];
        let arrayExchangRate = [historyUSDT, historyBTC, historyETH];
        let shSmart = new ShSmartRebalanceTester(arrayCoins, windowstudy, initinvestment, arrayInitInvest, arrayExchangRate, 7);
        //console.log("shSmart.NumberofCoins:", shSmart.NumberofCoins);
        //console.log("shSmart.LengthofData:", shSmart.LengthofData);
        //console.log("shSmart.ArrayofCoins[0]:",shSmart.ArrayofCoins[0]);

        const resArray = new Array(6).fill(initinvestment);
        let result = shSmart.runSHrebalance_AcceleratBase();
        resultSHRebalance_A = resArray.concat(result.RESULT);
        let maxWorkingCaptal = result.maxWorkingCapital;
        console.log(`maxWorkingCaptal in A_base Simulation: ${maxWorkingCaptal}`);
        //console.log("resultSHRebalance:", resultSHRebalance);
        //---------------------------------------------
        //--- success alert
        Swal.fire({
            text: "اطلاعات دریافت شد",
            icon: "success",
            timer: 1000
        });
    });

    $("#ShRebalance_AcceleratBase_Corolation").on("click", function () {
        //let sliceMAusdt = maUSTD.ma.slice(0, selectedSlice + 1);
        //let sliceMAbtc = maBTC.ma.slice(0, selectedSlice + 1);
        //let sliceMAeth = maETH.ma.slice(0, selectedSlice + 1);

        let arrayCoins = [maUSTD.ma, maBTC.ma, maETH.ma];
        let windowstudy = 10;
        let initinvestment = 30000000;
        let arrayInitInvest = [10000000, 10000000, 10000000];
        let arrayExchangRate = [historyUSDT, historyBTC, historyETH];
        let shSmart = new ShSmartRebalanceTester(arrayCoins, windowstudy, initinvestment, arrayInitInvest, arrayExchangRate, 7);
        //console.log("shSmart.NumberofCoins:", shSmart.NumberofCoins);
        //console.log("shSmart.LengthofData:", shSmart.LengthofData);
        //console.log("shSmart.ArrayofCoins[0]:",shSmart.ArrayofCoins[0]);

        const resArray = new Array(6).fill(initinvestment);
        let result = shSmart.runSHrebalance_AcceleratBase_Corolation();
        resultSHRebalance_A_C = resArray.concat(result.RESULT);
        let maxWorkingCapital = result.maxWorkingCapital;
        console.log(`maxWorkingCapital in Corr_sim: ${maxWorkingCapital}`);
        //console.log("resultSHRebalance_A_C:", resultSHRebalance_A_C);
        //--- varify Study
        //let resultCorVarified = result.resultCorVarified;
        //console.log(`resultCorVarified:${resultCorVarified}`);
        //----

        //---------------------------------------------
        //--- success alert
        Swal.fire({
            text: "اطلاعات دریافت شد",
            icon: "success",
            timer: 1000
        });
    });

    $("#plotCompareResults").on("click", function () {

        plotCompareChart(xValue, resultSmartRebalance, resultSHRebalance_V, resultSHRebalance_A, resultSHRebalance_A_C);
        plotTEPIXChart(xValue, tepix_Market, tepix_SmartRebalance);
        Swal.fire({
            text: "عملیات موفق",
            icon: "success",
            timer: 1000
        });
    });

    $("#runCov").on("click", function () {
        //---slice Study
        let usdtSlice = historyUSDT.slice(185, 240);
        let btcSlice = historyBTC.slice(185, 240);
        let ethSlice = historyETH.slice(185, 240);
        let arraySliceCoins = [usdtSlice, btcSlice, ethSlice];
        //-------------
        let arrayCoins = [historyUSDT, historyBTC, historyETH];

        let arrayIndex = [];
        for (let i = 0; i < arrayCoins.length; i++) {
            arrayIndex[i] = i;
        }

        let combineIndex = combine(arrayIndex, 2);
        for (let i = 0; i < combineIndex.length; i++) {
            let pairCoinsIndex = [];
            pairCoinsIndex = combineIndex[i];
            console.log("pairCoinsIndex:", pairCoinsIndex);
            let covArray = [];
            let arrayIndex_1 = pairCoinsIndex[0];
            let arrayIndex_2 = pairCoinsIndex[1];
            //covArray[i] = calculateCovariance(arrayCoins[arrayIndex_1], arrayCoins[arrayIndex_2]);
            //console.log(`covArray[${i}] : ${covArray[i]}`);
            let sampleCorolationCoffitiont = [];
            sampleCorolationCoffitiont[i] = PearsonSampleCorrelationCoefficient(arrayCoins[arrayIndex_1], arrayCoins[arrayIndex_2]);
            console.log(`sampleCorolationCoffitiont[${i}] : ${sampleCorolationCoffitiont[i]}`);
            //--- slice Study
            let sliceSampleCorolationCoffitiont = [];
            sliceSampleCorolationCoffitiont[i] = PearsonSampleCorrelationCoefficient(arraySliceCoins[arrayIndex_1], arraySliceCoins[arrayIndex_2]);
            console.log(`sliceSampleCorolationCoffitiont[${i}] : ${sliceSampleCorolationCoffitiont[i]}`);
            //----

        }

    });

    let resultMovingCorolation = [];
    $("#runMovingCorolation").on("click", function () {

        let arrayCoins = [historyUSDT, historyBTC, historyETH];

        resultMovingCorolation = MovingCorolation(7, arrayCoins);

        let ermc = ExportResultMovingCorolation(resultMovingCorolation);

        plot3MovingCorolation(ermc.xValueToPlot, ermc.movCor_1, ermc.movCor_2, ermc.movCor_3);

        Swal.fire({
            text: "عملیات موفق بود",
            icon: "success",
            timer: 1000
        });
    });

    $("#runStudyTEPIX").click(function () {

        tepixStudy();
    });

    function SmartRebalance(InitTotalInvest, RatioArray, USDThistory, BTChistory, ETHhistory) {
        var resultTotalInvestment = [];
        var USDTassets = [];
        var BTCassets = [];
        var ETHassets = [];
        var xValue = [];
        var USDTInvest = [];
        var BTCInvest = [];
        var ETHInvest = [];
        //---
        let initInvestArray = shGetInitInvestArray(RatioArray, InitTotalInvest);


        //---first step
        var myBasket = new Basket(
            initInvestArray,
            [USDThistory[0], BTChistory[0], ETHhistory[0]],
            []);
        myBasket.arrayAssets = myBasket.getAssets();
        myBasket.TotalInvestment = myBasket.getTotalInvestment();
        myBasket.arrayBasketPercentage = myBasket.getBasketPercentage();
        //console.log("myBasket:", myBasket);

        resultTotalInvestment[0] = myBasket.TotalInvestment;
        USDTassets[0] = myBasket.arrayAssets[0];
        BTCassets[0] = myBasket.arrayAssets[1];
        ETHassets[0] = myBasket.arrayAssets[2];
        xValue[0] = 1;
        USDTInvest[0] = myBasket.arrayInvestment[0];
        BTCInvest[0] = myBasket.arrayInvestment[1];
        ETHInvest[0] = myBasket.arrayInvestment[2];

        for (var i = 1; i < USDThistory.length; i++) {
            //---secend step
            var basketBeforRebalance = new Basket([], [USDThistory[i], BTChistory[i], ETHhistory[i]], myBasket.arrayAssets);

            basketBeforRebalance.arrayInvestment = basketBeforRebalance.getInvestment();
            basketBeforRebalance.TotalInvestment = basketBeforRebalance.getTotalInvestment();
            basketBeforRebalance.arrayBasketPercentage = basketBeforRebalance.getBasketPercentage();
            //console.log("basketBeforRebalance:", basketBeforRebalance);

            //---third step
            var basketAfterRebalance = new Basket([], basketBeforRebalance.arrayExchangeRate, []);
            basketAfterRebalance.arrayBasketPercentage = myBasket.arrayBasketPercentage;
            basketAfterRebalance.TotalInvestment = basketBeforRebalance.TotalInvestment;
            basketAfterRebalance.arrayInvestment = basketAfterRebalance.getInvestmentUsingTotalInvestment();
            basketAfterRebalance.arrayAssets = basketAfterRebalance.getAssets();
            //console.log("basketAfterRebalance:", basketAfterRebalance);

            resultTotalInvestment[i] = basketAfterRebalance.TotalInvestment;
            myBasket.arrayAssets = basketAfterRebalance.arrayAssets;
            myBasket.arrayExchangeRate = basketAfterRebalance.arrayExchangeRate;
            myBasket.arrayInvestment = basketAfterRebalance.arrayInvestment;
            myBasket.TotalInvestment = basketAfterRebalance.TotalInvestment;
            myBasket.arrayBasketPercentage = basketAfterRebalance.arrayBasketPercentage;
            USDTassets[i] = myBasket.arrayAssets[0];
            BTCassets[i] = myBasket.arrayAssets[1];
            ETHassets[i] = myBasket.arrayAssets[2];
            xValue[i] = i + 1;
            USDTInvest[i] = myBasket.arrayInvestment[0];
            BTCInvest[i] = myBasket.arrayInvestment[1];
            ETHInvest[i] = myBasket.arrayInvestment[2];

        }

        //console.log("TotalInvestment:", TotalInvestment);
        //console.log("USDTassets: ", USDTassets);
        //console.log("BTCassets: ", BTCassets);
        //console.log("ETHassets: ", ETHassets);

        return { xValue: xValue, resultSmartRebalance: resultTotalInvestment };

    }

    function plotCompareChart(xvalue, resultSmartRebalance, resultSHRebalanceV, resultSHRebalanceA, resultSHRebalance_A_C) {

        new Chart("CompareResultChart", {
            type: "line",
            data: {
                labels: xvalue,
                datasets: [
                    {
                        data: resultSmartRebalance,
                        borderColor: "red",
                        fill: false,
                        label: "SmartRebalance"
                    }
                    , {
                        data: resultSHRebalanceV,
                        borderColor: "green",
                        fill: false,
                        label: "SH smart rebalance V"
                    }
                    , {
                        data: resultSHRebalanceA,
                        borderColor: "blue",
                        fill: false,
                        label: "SH smart rebalance A"
                    }, {
                        data: resultSHRebalance_A_C,
                        borderColor: "black",
                        fill: false,
                        label: "SH smart rebalance A_C"
                    }
                ]
            },
            options: {
                legend: { display: true }
            }
        });
    }

    function plotUSDT(xvalue, usdtexgchange, ma) {

        new Chart("usdtChart", {
            type: "line",
            data: {
                labels: xvalue,
                datasets: [{
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "rgba(0,0,255,1.0)",
                    //borderColor: "rgba(0,0,255,0.1)",
                    data: usdtexgchange
                }, {
                    data: ma,
                    borderColor: "green",
                    fill: false
                }]
            },
            options: {
                legend: { display: false },
                scales: {
                    yAxes: [{ ticks: { min: 0, max: 1 } }],
                }
            }
        });
    }

    function plotTEPIXChart(xvalue, tepixMarket, tepixSmartRebalance) {

        new Chart("tepixChart", {
            type: "line",
            data: {
                labels: xvalue,
                datasets: [
                    {
                        data: tepixMarket,
                        borderColor: "red",
                        fill: false,
                        label: "tepix Market"
                    }
                    , {
                        data: tepixSmartRebalance,
                        borderColor: "green",
                        fill: false,
                        label: "tepix Smart Rebalance"
                    }

                ]
            },
            options: {
                legend: { display: true }
            }
        });
    }

    function plotTEPIXStudy(xvalue, tepixMarket, tepix_A_C, tepix_A, tepix_V) {

        new Chart("tepixStudy", {
            type: "line",
            data: {
                labels: xvalue,
                datasets: [
                    {
                        data: tepixMarket,
                        borderColor: "red",
                        fill: false,
                        label: "tepix Market"
                    }, {
                        data: tepix_V,
                        borderColor: "green",
                        fill: false,
                        label: "tepix_V"
                    }, {
                        data: tepix_A,
                        borderColor: "blue",
                        fill: false,
                        label: "tepix_A"
                    }, {
                        data: tepix_A_C,
                        borderColor: "black",
                        fill: false,
                        label: "tepix_A_C"
                    }

                ]
            },
            options: {
                legend: { display: true }
            }
        });
    }

    function plotTEPIXStudy3Coins(xvalue, tepix_USDT, tepix_BTC, tepix_ETH) {

        new Chart("tepixStudy3Coins", {
            type: "line",
            data: {
                labels: xvalue,
                datasets: [
                    {
                        data: tepix_USDT,
                        borderColor: "red",
                        fill: false,
                        label: "tepix_USDT"
                    }, {
                        data: tepix_ETH,
                        borderColor: "black",
                        fill: false,
                        label: "tepix_ETH"
                    }, {
                        data: tepix_BTC,
                        borderColor: "blue",
                        fill: false,
                        label: "tepix_BTC"
                    }

                ]
            },
            options: {
                legend: { display: true }
            }
        });
    }

    function plot3SliceNormMA(xvalue, maUSDT, maBTC, maETH) {

        new Chart("3SliceMAChart", {
            type: "line",
            data: {
                labels: xvalue,
                datasets: [{
                    fill: false,
                    lineTension: 0,
                    //backgroundColor: "rgba(0,0,255,1.0)",
                    borderColor: "blue",
                    data: maUSDT,
                    label: "maUSDT"
                }, {
                    data: maBTC,
                    label: "maBTC",
                    borderColor: "green",
                    fill: false
                }, {
                    data: maETH,
                    label: "maETH",
                    borderColor: "black",
                    fill: false
                }]
            },
            options: {
                legend: { display: true },
                scales: {
                    yAxes: [{ ticks: { min: 0, max: 1 } }],
                }
            }
        });
    }

    function plot3NormMA(xvalue, maUSDT, maBTC, maETH) {

        new Chart("3NormMAChart", {
            type: "line",
            data: {
                labels: xvalue,
                datasets: [{
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "rgba(0,0,255,1.0)",
                    //borderColor: "rgba(0,0,255,0.1)",
                    data: maUSDT,
                    label: "maUSDT"
                }, {
                    data: maBTC,
                    label: "maBTC",
                    borderColor: "green",
                    fill: false
                }, {
                    data: maETH,
                    label: "maETH",
                    borderColor: "black",
                    fill: false
                }]
            },
            options: {
                legend: { display: true },
                scales: {
                    yAxes: [{ ticks: { min: 0, max: 1 } }],
                }
            }
        });
    }

    function plot3VMA(xvalue, vmaUSDT, vmaBTC, vmaETH) {

        new Chart("3VMAChart", {
            type: "line",
            data: {
                labels: xvalue,
                datasets: [{
                    fill: false,
                    //lineTension: 0,
                    //backgroundColor: "blue",
                    borderColor: "blue",
                    data: vmaUSDT,
                    label: "vmaUSDT"
                }, {
                    data: vmaBTC,
                    label: "vmaBTC",
                    borderColor: "green",
                    fill: false
                }, {
                    data: vmaETH,
                    label: "vmaETH",
                    borderColor: "black",
                    fill: false
                }]
            },
            options: {
                legend: { display: true },
                scales: {
                    yAxes: [{ ticks: { min: -0.05, max: 0.05 } }],
                }
            }
        });
    }

    function plot3NormVMA(xvalue, normVmaUSDT, normVmaBTC, normVmaETH) {

        new Chart("3NormVMAChart", {
            type: "line",
            data: {
                labels: xvalue,
                datasets: [{
                    fill: false,
                    //lineTension: 0,
                    //backgroundColor: "blue",
                    borderColor: "blue",
                    data: normVmaUSDT,
                    label: "NormVmaUSDT"
                }, {
                    data: normVmaBTC,
                    label: "NormVmaBTC",
                    borderColor: "green",
                    fill: false
                }, {
                    data: normVmaETH,
                    label: "NormVmaETH",
                    borderColor: "black",
                    fill: false
                }]
            },
            options: {
                legend: { display: true },
                //scales: {
                //    yAxes: [{ ticks: { min: -0.05, max: 0.05 } }],
                //}
            }
        });
    }

    function plot3MovingCorolation(xvalue, movingCor_1, movingCor_2, movingCor_3) {

        new Chart("3MovingCorChart", {
            type: "line",
            data: {
                labels: xvalue,
                datasets: [{
                    fill: false,
                    //lineTension: 0,
                    //backgroundColor: "blue",
                    borderColor: "blue",
                    data: movingCor_1,
                    label: "USDT-BTC"
                }, {
                    data: movingCor_2,
                    label: "USDT-ETH",
                    borderColor: "green",
                    fill: false
                }, {
                    data: movingCor_3,
                    label: "BTC-ETH",
                    borderColor: "black",
                    fill: false
                }]
            },
            options: {
                legend: { display: true },
                //scales: {
                //    yAxes: [{ ticks: { min: -0.05, max: 0.05 } }],
                //}
            }
        });
    }

    function plotAma(xvalue, Ama) {



        new Chart("AmaChart", {
            type: "line",
            data: {
                labels: xvalue,
                datasets: [{
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "rgba(0,0,255,1.0)",
                    borderColor: "rgba(0,0,255,0.1)",
                    data: Ama
                }]
            },
            options: {
                legend: { display: false },
                scales: {
                    yAxes: [{ ticks: { min: -0.011, max: 0.011 } }],
                }
            }
        });
    }

    function plotVma(xvalue, Vma) {

        new Chart("VmaChart", {
            type: "line",
            data: {
                labels: xvalue,
                datasets: [{
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "rgba(0,0,255,1.0)",
                    borderColor: "rgba(0,0,255,0.1)",
                    data: Vma
                }]
            },
            options: {
                legend: { display: false },
                scales: {
                    yAxes: [{ ticks: { min: -0.011, max: 0.011 } }],
                }
            }
        });
    }

    function plotVAma(xvalue, VAma) {

        new Chart("VAmaChart", {
            type: "line",
            data: {
                labels: xvalue,
                datasets: [{
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "rgba(0,0,255,1.0)",
                    borderColor: "rgba(0,0,255,0.1)",
                    data: VAma
                }]
            },
            options: {
                legend: { display: false },
                scales: {
                    yAxes: [{ ticks: { min: -0.011, max: 0.011 } }],
                }
            }
        });
    }

    function plotVprice(xvalue, Vprice) {

        new Chart("VpriceChart", {
            type: "line",
            data: {
                labels: xvalue,
                datasets: [{
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "rgba(0,0,255,1.0)",
                    borderColor: "rgba(0,0,255,0.1)",
                    data: Vprice
                }]
            },
            options: {
                legend: { display: false },
                scales: {
                    yAxes: [{ ticks: { min: -0.052, max: 0.052 } }],
                }
            }
        });
    }

    //let xvalue = Array.from(Array(10), (_, i) => i + 1);
    //let ma = MA(7, xvalue);
    //console.log("ma:", ma);
    function MA(period, arrayPrice) {
        let ma = [];
        if (arrayPrice.length >= period) {
            for (var k = 0; k < arrayPrice.length - period + 1; k++) {

                let sum = 0;
                for (var i = k; i <= period - 1 + k; i++) {
                    sum = sum + arrayPrice[i];
                }
                ma[k] = sum / period;
            }

        }
        let lenma = ma.length;
        let lenprice = arrayPrice.length;
        const zerosArray = new Array(lenprice - lenma).fill(0);
        let result = zerosArray.concat(ma);

        return { result: result, ma: ma };
    }

    function VilocityArray(arrayInput) {
        let Varray = [];

        for (var i = 1; i < arrayInput.length; i++) {
            Varray[i - 1] = (arrayInput[i] - arrayInput[i - 1]) / Math.abs(arrayInput[i - 1]);
        }

        let lenVarray = Varray.length;
        let lenInput = arrayInput.length;
        const zerosArray = new Array(lenInput - lenVarray).fill(0);
        let result = zerosArray.concat(Varray);

        return { result: result, Varray: Varray };
    }

    function VilocityMA(maInput, PriceLenght) {
        let Varray = VilocityArray(maInput);

        const zerosArray = new Array(PriceLenght - Varray.Varray.length).fill(0);
        let result = zerosArray.concat(Varray.Varray);
        return result;
    }

    function AccelerateMA(maInput, PriceLenght) {
        let Varray = VilocityArray(maInput);
        let arrayInput = Varray.Varray;
        let Aarray = [];

        for (var i = 1; i < arrayInput.length; i++) {
            Aarray[i - 1] = (arrayInput[i] - arrayInput[i - 1]);
        }

        const zerosArray = new Array(PriceLenght - Aarray.length).fill(0);
        let result = zerosArray.concat(Aarray);
        return result;
    }

    function ViloAccMA(arrayInput, PriceLenght) {
        let Aarray = [];
        for (var i = 1; i < arrayInput.length; i++) {
            Aarray[i - 1] = (arrayInput[i] - arrayInput[i - 1]);
        }

        const zerosArray = new Array(PriceLenght - Aarray.length).fill(0);
        let result = zerosArray.concat(Aarray);
        return result;

    }

    function ReadyVmaAmatoPlot(Vma, Ama, PeriodMA) {
        let outLenght = PeriodMA + 1;
        const selectedVma = Vma.slice(outLenght, Vma.length); // Select elements at index outLenght and Vma.length
        const selectedAma = Ama.slice(outLenght, Ama.length);
        return { selectedVma: selectedVma, selectedAma: selectedAma }
    }

    function calculateStandardDeviation(numbers) {
        const mean = numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
        const variance = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numbers.length;
        const standardDeviation = Math.sqrt(variance);
        return standardDeviation;
    }

    //--- a tepix Study
    function tepixStudy() {
        let ustd_slice = historyUSDT.slice(6);
        let btc_slice = historyBTC.slice(6);
        let eth_slice = historyETH.slice(6);
        let sh_A_C_result_slice = resultSHRebalance_A_C.slice(6);
        let sh_A_result_slice = resultSHRebalance_A.slice(6);
        let sh_V_result_slice = resultSHRebalance_V.slice(6);


        let tepix_usdt = TEPIXindex(ustd_slice);
        let tepix_btc = TEPIXindex(btc_slice);
        let tepix_eth = TEPIXindex(eth_slice);

        let tepix_market = TEPIX_MARKET_INDEX(tepix_usdt, tepix_btc, tepix_eth);
        let tepix_sh_A_C_result = TEPIXindex(sh_A_C_result_slice);
        let tepix_sh_A_result = TEPIXindex(sh_A_result_slice);
        let tepix_sh_V_result = TEPIXindex(sh_V_result_slice);

        let xvalue = Array.from(Array(tepix_market.length), (_, i) => i + 1);

        plotTEPIXStudy(xvalue, tepix_market, tepix_sh_A_C_result, tepix_sh_A_result, tepix_sh_V_result);

        plotTEPIXStudy3Coins(xvalue, tepix_usdt, tepix_btc, tepix_eth);

    }


});