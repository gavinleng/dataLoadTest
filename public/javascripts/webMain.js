/*
 * Created by G on 06/01/2016.
 */


$.get('http://localhost:3008/data', function (dataArray) {
    var diff = (new Date().getTime() - dataArray[3]);

    d3.select("#loadTimeServer").text(dataArray[0]);
    d3.select("#loadTimeClient").text(diff);
    d3.select("#roadNum").text(dataArray[1]);
    d3.select("#roadName").text(dataArray[2]);
});
