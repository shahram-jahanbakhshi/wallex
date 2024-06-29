$(document).ready(function () {

    let minInterval = 5000;

    var interval = setInterval(time, 1000);


    function time() {
        var date = new Date();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        $('#time1').text(hour + ":" + min + ":" + sec);
        let getrealprice = getRealTimePrice("BTCTMN", "BUY");
        $('#realPriceShow').text(getrealprice.result.price);

    }

    //$("#realTimePrice").click(function () {
    //    getRealTimePrice("BTCTMN", "BUY");
    //})
    
    getRealTimePrice("BTCTMN", "BUY");

    $('#getRealPrice').click(function () {
        getRealPrice("BTCTMN", "BUY");
    } );
        
    
});

