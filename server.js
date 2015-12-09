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

    $App.render(response, $App.logged ? 'index' : 'login');
});

app.get('/username', function (req, response, next) {
    if (isLogged()) {
        response.send($App.user_name);
    } else {
        $App.render(response, "login");
    }
});

app.get('/delete-user', function (req, response, next) {
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
                    $App.render(response, 'users-list', {"rows": rows});
                }
            });
        }
    });
});

app.post('/add-user', function (req, response, next) {
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
            $App.render(response, 'users-list', {"rows": rows});
        }
    });
});

app.get('/tests', function (req, response, next) {
    $App.render(response, 'tests-list');
});

app.get('/tests-add', function (req, response, next) {
    $App.render(response, 'tests-add');
});

$App.render = function (res, page, params) {
    if (page == 'login') {
        res.render('login.twig');
    } else {
        if ($App.logged) {
            params = params || {};
            params.username = $App.user_name;
            res.render(page + '.twig', params);
        } else {
            res.render('_denied.twig');
        }
    }
};

//app.get('/username', function (req, response, next) {
//    response.send($App.user_name);
//});
app.get('/login-form', function (req, response, next) {
    $App.render(response, 'login');
});

function log(msg) {
    console.log(msg);
}

function isLogged() {
    if (!$App.logged)$App.logged = (localStorage.getItem('logged') == 'true');
    return $App.logged;
}

app.get('/users-add', function (req, response, next) {
    $App.render(response, 'users-add');
});


app.get('/users-list', function (req, response, next) {
    var $q = "SELECT * FROM users WHERE nick != 'admin'";
    var query = connection.query($q, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            $App.render(response, 'users-list', {"rows": rows});
        }
    });
});

app.post('/login', function (req, response, next) {
    var $q = "SELECT * FROM users WHERE nick = '" + req.body.login_name + "' and pw = md5('" + req.body.login_pw + "')";
    console.log($q);
    var query = connection.query($q, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            if (rows.length > 0) {
                console.log('User logged: ' + rows[0].nick + '=>' + rows[0].fullname);
                $App.logged = true;
                $App.user_name = rows[0].nick;
                $App.full_name = rows[0].fullname;
                //localStorage.setItem('logged', true);

                $App.render(response, 'index');
                $App.logout = setTimeout(function () {
                    $App.logged = false;
                    console.log('Odhlaseno');
                    //localStorage.clear();
                }, $App.autologout);
            } else {
                console.log('Failed: ' + $q);
                response.send('false');
            }
        }
    });
});

app.get('/logout', function (req, response, next) {
    $App.logged = false;
    $App.render(response,'login');
});

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});