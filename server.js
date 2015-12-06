var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var qs = require('querystring');
var util = require('util');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'silar'
});

var $App = $App || {};

$App.logged = false;
$App.user_name = false;
$App.full_name = false;
$App.autologout = 15*60*1000;
//$App.autologout = 5000;
$App.logout = false;


var server = http.createServer(function (request, response) {
    var filePath = false;

    if($App.logout != false){
        clearTimeout($App.logout);
        $App.logout = setTimeout(function(){
            $App.logged = false;
            console.log('Odhlaseno');
        },$App.autologout);
    }

    if (request.method === "GET") {
        if (request.url == '/') {
            filePath = "web/views/login.html";
            if($App.logged){
                if($App.user_name == 'admin') {
                    filePath = "web/views/index.html";
                }else filePath = "web/views/index-users.html";
            }
        } else {
            filePath = "web/" + request.url;
        }
        var absPath = "./" + filePath;
        serverWorking(response, absPath);
    } else if (request.method === "POST") {
        $App.handleRequest(request, response);
    }


}).listen(3000);

$App.handleRequest = function (req,response) {
    var requestBody = '';

    switch (req.url) {
        case '/test':
            req.on('data', function (data) {
                requestBody += data;
            });
            req.on('end', function () {
                var formData = qs.parse(requestBody);
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write(formData.data + '--' + formData.bagr + "--" + util.inspect(formData, {showHidden: false, depth: null}) + '=>' + requestBody);
                response.end('</body></html>');
            });
            break;
        case '/login':
            req.on('data', function (data) {
                requestBody += data;
            });
            req.on('end', function () {
                var formData = qs.parse(requestBody);

                var $q = "SELECT * FROM users WHERE nick = '"+formData.login_name+"' and pw = md5('"+formData.login_pw+"')";
                var query = connection.query($q,function(err, rows) {
                    if(rows.length > 0){
                        response.end('good job');
                        console.log('User logged: ' + rows[0].nick + '=>' + rows[0].fullname);
                        $App.logged = true;
                        $App.user_name = rows[0].nick;
                        $App.full_name = rows[0].fullname;
                        $App.logout = setTimeout(function(){
                            $App.logged = false;
                            console.log('zmizni!');
                        },$App.autologout);
                    }else{
                        console.log('Failed: ' + $q);
                        response.end('false');
                    }
                });
            });
            break;
        case '/logout':
            $App.logged = false;
            req.on('data', function (data) {});
            req.on('end', function () {
                response.end('done');
            });
            break;
    }
};

function send404(response) {
    response.writeHead(404, {"Content-type": "text/plain"});
    response.write("Error 404: resource not found");
    response.end();
}

function sendPage(response, filePath, fileContents) {
    response.writeHead(200, {"Content-type": mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

function serverWorking(response, absPath) {
    fs.exists(absPath, function (exists) {
        if (exists) {
            fs.readFile(absPath, function (err, data) {
                if (err) {
                    send404(response)
                } else {
                    sendPage(response, absPath, data);
                }
            });
        } else {
            send404(response);
        }
    });
}