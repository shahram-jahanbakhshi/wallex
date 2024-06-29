$(document).ready(function () {
    //---tste region
   

    $("#StartShSR").click(function () {
        getInitialHistoryToNow("BTCTMN", ResolutionConfig.Day)
    });
});

let ResolutionConfig = {
    Minute: '1',
    Hour: '60',
    Day: '1D'
}
/**
 * 
 * @param {string} resolution
 * @param {string} symbol
 */
function getInitialHistoryToNow(symbol, resolution) {

    $.post("/ShSR/getInitialHistoryToNow", { symbol: symbol, resolution: resolution })
        .done(function (res) {

            if (res.getSuccess) {
                console.log("getInitialHistoryToNow res:", res.message);
            }
            else {
                console.log("getInitialHistoryToNow error:", res.message);
            }
        })
        .fail(function () {

        });
}