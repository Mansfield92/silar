var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var qs = require('querystring');
var util = require('util');
var mysql = require('mysql');
var Twig = require('twig');
var express = require('express');
var bodyParser = require('body-parser')

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'silar'
});

var $App = $App || {};

$App.logged = false;
$App.user_name = false;
$App.full_name = false;
$App.autologout = 15 * 60 * 1000;
$App.logout = false;

var app = express();
var server = require('http').createServer(app);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'web')));

app.set('port', process.env.PORT || 3000);

app.get('/', function (req, response, next) {
    //console.log(browserWindow.localstorage.get('username'));

    if ($App.logout != false) {
        clearTimeout($App.logout);
        $App.logout = setTimeout(function () {
            $App.logged = false;
            console.log('Odhlaseno');
        }, $App.autologout);
    }
    var filePath = "";
    if ($App.logged) {
        if ($App.user_name == 'admin') {
            filePath = "index.twig";
        } else filePath = "index-users.twig";
    } else filePath = "login.twig";

    response.render(filePath);
});

app.get('/username', function (req, response, next) {
    response.send($App.user_name);
});
app.use('/login', function (req, response, next) {
    var $q = "SELECT * FROM users WHERE nick = '" + req.body.login_name + "' and pw = md5('" + req.body.login_pw + "')";
    console.log($q);
    var query = connection.query($q, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            if (rows.length > 0) {
                response.send('good job');
                console.log('User logged: ' + rows[0].nick + '=>' + rows[0].fullname);
                $App.logged = true;
                $App.user_name = rows[0].nick;
                $App.full_name = rows[0].fullname;
                //window.localStorage.setItem('username',$App.user_name);
                $App.logout = setTimeout(function () {
                    $App.logged = false;
                    console.log('zmizni!');
                }, $App.autologout);
            } else {
                console.log('Failed: ' + $q);
                response.send('false');
            }
        }
    });
});
app.use('/logout', function (req, response, next) {
    $App.logged = false;
    response.send('done');
});

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});