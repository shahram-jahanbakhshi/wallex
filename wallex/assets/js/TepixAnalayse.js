$(document).ready(function () {

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

    let coinsOBJ_1 = {
        TRXT: "TRXTMN",
        XRP: "XRPTMN",
        BTC: "BTCTMN"
    };
   
    let coinsOBJ_2 = {
        ADA: "ADATMN",
        USDT: "USDTTMN",
        ETH: "ETHTMN"
    }

    let listCOINS = [coinsOBJ_1, coinsOBJ_2];
    let plotArrayID = ["tepixChart3Coins_1", "tepixChart3Coins_2"];

    for (let i = 0; i < listCOINS.length; i++) {
        sh_runTepix3Coins(listCOINS[i], "1D", fromTimestamp, toTimestamp, plotArrayID[i]);
    }

    

   

});