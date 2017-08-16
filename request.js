var express = require('express');
var request = require('request');
var https = require('http');
var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (test, response) {
    // res.send('hello world')
    var options = {
        method: 'GET',
        json: true,
        url: 'https://www.instagram.com/cattinas/media/0d9ab51f764f4669a84e30aaf69bf1f3'
    };

    request(options, function(err, res, body) {
        if (err) {
            console.error('error posting json: ', err);
            throw err
        }
        var headers = res.headers;
        var statusCode = res.statusCode;
        console.log('headers: ', headers);
        console.log('statusCode: ', statusCode);
        console.log('body: ', body)
    });

});
app.listen(3010, function () {
    console.log('Example app listening on port 3000!')
});
