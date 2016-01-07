/*
 * Created by G on 06/01/2016.
 */


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require("http");

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/data', function (req, res1) {
    var count = 159062;
    var baseurl = '/v1/datasets/41-CCIo4wl/';
    baseurl += 'data?opts={"limit":' + count + '}';
    var filterurl = 'proj={"properties.ROAD_NAME":1,"_id":0}';
    var dataurl = baseurl + '&' + filterurl;

    var options = {
        host: 'q.nqminds.com',
        path: dataurl
    };

    var start = new Date().getTime();

    http.get(options, function(res){
        body = [];

        res.on('data', function(chunk){
            body.push(chunk);
        }).on('end', function(){
            body = Buffer.concat(body);
            console.log("Got road name data from URL");

            var data11 = JSON.parse(body);

            var roadNames = data11.data;

            var diff = (new Date().getTime() - start);

            var len = roadNames.length;

            var roadText = [];

            for (var i = 0; i < len; i++) {
                roadText.push(roadNames[i].properties.ROAD_NAME);
            }

            roadText = uniq(roadText);

            len = roadText.length;

            roadText = roadText.join("; ");

            roadText += ".";

            res1.send([diff, len, roadText, new Date().getTime()]);
        });
    }).on('error', function(e){
        console.log("Got an error: ", e);
    });
});

function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

app.get('/', function (req, res) {
    res.render('index', {
        title: "Data Loading Test"
    });
});

var ipaddress = "localhost";
var port = 3008;

app.listen(port, ipaddress, function () {
    console.log( "Listening on " + ipaddress + ", server_port " + port );
    console.log( "Server running at http://" + ipaddress + ":" + port + "/");
});
