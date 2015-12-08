var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var qs = require('querystring');
var util = require('util');
var mysql = require('mysql');
var Twig = require('twig');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');
var localStorage = require('localStorage');

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'silar'
});

var $App = $App || {};

//$App.logged = (localStorage.getItem('logged') == true);
$App.logged = true;
//$App.user_name = false;
$App.user_name = 'admin';
$App.full_name = false;
$App.autologout = 15 * 60 * 1000;
$App.logout = false;

var app = express();
var server = require('http').createServer(app);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'web')));

app.set('port', process.env.PORT || 3000);

app.get('/', function (req, response, next) {
    if ($App.logout != false) {
        clearTimeout($App.logout);
        $App.logout = setTimeout(function () {
            $App.logged = false;
            console.log('Odhlaseno');
            localStorage.clear();
        }, $App.autologout);
    }
    var filePath = "";
    if (isLogged()) {
        if ($App.user_name == 'admin') {
            filePath = "index.twig";
        } else filePath = "index-users.twig";
    } else filePath = "login.twig";

    response.render(filePath);
});

app.get('/username', function (req, response, next) {
    if (isLogged()) {
        response.send($App.user_name);
    } else {
        response.render("login.twig");
    }
});

app.get('/delete', function (req, response, next) {
    if (isLogged()) {
        var $q = "DELETE FROM users WHERE id_user = '" + req.query.id_user + "'";
        var query = connection.query($q, function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                log('deleted?' + $q);
                $q = "SELECT * FROM users WHERE nick != 'admin'";
                query = connection.query($q, function (err, rows) {
                    if (err) {
                        console.log(err);
                    } else {
                        response.render('users-list.twig', {"rows": rows});
                    }
                });
            }
        });
    } else {
        response.render("login.twig");
    }
});


app.post('/add-user', function (req, response, next) {
    if (isLogged()) {
        var $q = "INSERT INTO `silar`.`users` (`id_user`, `nick`, `pw`, `fullname`) VALUES (NULL, ?, MD5(?), ?)";
        var query = connection.query($q, [req.body.username, req.body.password, req.body.fullname], function (err, rows) {
            if (err) {
                console.log(err);
            }
        });
        $q = "SELECT * FROM users WHERE nick != 'admin'";
        query = connection.query($q, function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                response.render('users-list.twig', {"rows": rows});
            }
        });
    } else {
        response.render("login.twig");
    }
});

function log(msg) {
    console.log(msg);
}

function isLogged() {
    //log(localStorage.getItem('logged'));
    //log(localStorage.getItem('logged') ==  'true');
    if (!$App.logged)$App.logged = (localStorage.getItem('logged') == 'true');
    return $App.logged;
}

app.get('/users-add', function (req, response, next) {
    if (isLogged()) {
        response.render('users-add.twig');
    } else {
        response.render("login.twig");
    }
});


app.get('/users-list', function (req, response, next) {
    if (isLogged()) {
        var $q = "SELECT * FROM users WHERE nick != 'admin'";
        var query = connection.query($q, function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                response.render('users-list.twig', {"rows": rows});

            }
        });
    } else {
        response.render("login.twig");
    }
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
                localStorage.setItem('logged', true);
                //window.localStorage.setItem('username',$App.user_name);
                $App.logout = setTimeout(function () {
                    $App.logged = false;
                    console.log('Odhlaseno');
                    localStorage.clear();
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