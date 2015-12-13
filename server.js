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
var async = require('async');

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'silar'
});

var $App = $App || {};

$App.testQuery = "SELECT * from tests";

//$App.logged = (localStorage.getItem('logged') == true);
$App.logged = false;
//$App.logged = true;
$App.user_name = false;
//$App.user_name = 'pica';
$App.user_id = false;
$App.full_name = false;
$App.autologout = 15 * 60 * 1000 * 1000;
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
app.get('/delete-result', function (req, response, next) {
    var $q = "DELETE FROM results WHERE id_user = '" + req.query.id_user + "' AND id_test= '" + req.query.id_test + "'";
    var query = connection.query($q, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            var $q = "SELECT name,points as vysledek,splnen, fullname, id_test, id_user  FROM tests left join results using(id_test) left join users using(id_user)";
            var query = connection.query($q, function (err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    $App.render(response, 'results', {"tests": rows});
                }
            });
        }
    });
});


app.get('/delete-test', function (req, response, next) {
    var $q = "DELETE FROM tests WHERE id_test = '" + req.query.id_test + "'";
    $App.helper = [];
    var query = connection.query($q, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            $q = "SELECT * FROM questions WHERE id_test = '" + req.query.id_test + "'";
            query = connection.query($q, function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {
                    for ($i in rows) {
                        var $idd = rows[$i].id_question;
                        $App.helper.push($idd);
                        query = connection.query("DELETE FROM answer where id_question = '" + $idd + "'", function (err, rows) {
                            if (err) {
                                log(err)
                            } else {
                                var $q = "DELETE FROM questions WHERE id_question = '" + $App.helper.pop() + "'";
                                query = connection.query($q, function (arr, rows) {
                                    if (arr) {
                                        log(arr)
                                    }
                                });
                            }
                        });
                    }
                }
            });
            connection.query($App.testQuery, function (error, result) {
                if (error)console.log($quest, error);
                else $App.render(response, 'tests-list', {"tests": result});
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
    var $tests;
    var $done;

    connection.query($App.testQuery, function (error, result) {

        $tests = result;
        $done = "SELECT * FROM `results` where id_user = " + $App.user_id;
        connection.query($done, function (error, ress) {
            $done = ress;
            $App.render(response, 'tests-list', {"tests": $tests,"done":$done});
        });
    });
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
            params.userid = $App.user_id;
            res.render(page + '.twig', params);
        } else {
            res.render('login.twig');
        }
    }
};

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
app.get('/results', function (req, response, next) {
    if(typeof req.query.id_user != 'undefined'){
        var $q = "SELECT name,points as vysledek,splnen, fullname, id_test, id_user  FROM tests left join results using(id_test) left join users using(id_user) WHERE id_user = '"+req.query.id_user+"'";
    }else $q = "SELECT name,points as vysledek,splnen, fullname, id_test, id_user  FROM tests left join results using(id_test) left join users using(id_user)";
    var query = connection.query($q, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            $App.render(response, 'results', {"tests": rows});
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
                $App.user_id = rows[0].id_user;
                $App.full_name = rows[0].fullname;

                //$App.testQuery = "select id_test, results.id_user, name as nazev, count(question_name) as otazek,sum(questions.points) as bodu " +
                //    "from tests left join results using(id_test) left join questions using(id_test) where results.id_user != "+$App.user_id+" OR results.id_user is NULL group by id_test";
                $App.testQuery = "select id_test,name as nazev, count(question_name) as otazek,sum(questions.points) as bodu from tests left join questions using(id_test) group by id_test";
                //localStorage.setItem('logged', true);

                $App.render(response, 'index');
                $App.logout = setTimeout(function () {
                    $App.logged = false;
                    console.log('Odhlaseno');
                    //localStorage.clear();
                }, $App.autologout);
            } else {
                console.log('Failed: ' + $q);
                $App.render(response,'login');
            }
        }
    });
});

app.post('/create-test', function (req, response, next) {
    $App.helper = [];
    //console.log(req.body);
    var $testname = req.body.test_name;

    $test = "INSERT INTO tests (`id_test`, `name`) VALUES (NULL, '" + $testname + "')";
    connection.query($test, function (err, result) {
        if (err)console.log($test, err); else {
            var $idtest = parseInt(result.insertId);
            for (var param in req.body) {
                if (param.indexOf('question') != -1) {
                    $question = req.body[param];
                    $id = param.substr(param.indexOf('question') + 8);
                    $App.helper.push($id);
                    $quest = "INSERT INTO questions (`id_question`, `question_name`, `points`, `id_test`) VALUES (NULL, '" + req.body[param] + "', " + parseInt(req.body['points' + $id]) + ", " + $idtest + ")";

                    connection.query($quest, function (error, res) {
                        if (error)console.log($quest, error); else {
                            $id = $App.helper.shift();

                            var $id_question = parseInt(res.insertId);
                            for (var i = 0; i <= 3; i++) {
                                if (typeof req.body['answer' + $id + '-' + i] !== 'undefined') {
                                    var $answer = req.body['answer' + $id + '-' + i];
                                    if (typeof req.body['right' + $id + '-' + i] !== 'undefined') {
                                        var $answ = "INSERT INTO answer (`id_answer`, `id_question`, `answer`, `correct`) VALUES (NULL, " + $id_question + ", '" + $answer + "', 'true');";
                                    } else {
                                        $answ = "INSERT INTO answer (`id_answer`, `id_question`, `answer`, `correct`) VALUES (NULL, " + $id_question + ", '" + $answer + "', 'false');";
                                    }
                                    connection.query($answ, function (error_answ, response_answ) {
                                        if (error_answ)console.log($quest, error_answ);
                                    });
                                } else {
                                    i = 4;
                                }
                            }
                        }
                    });
                }
            }
            connection.query($App.testQuery, function (error, result) {
                if (error)console.log($quest, error);
                else $App.render(response, 'tests-list', {"tests": result});
            });
        }
    });
});

app.get('/view-test', function (req, response, next) {
    var $id_test = req.query.id_test;
    var $points = 0;

    $render = "select id_test, name as nazev,count(question_name) as otazek,sum(points) as bodu from tests left join questions using(id_test) where id_test = '" + $id_test + "' group by id_test";
    connection.query($render, function (error, result) {
        $points = result[0].bodu;
    });

    $render = "SELECT * FROM tests left join questions using(id_test) left join answer using(id_question) where id_test = '" + $id_test + "'";
    var $query = connection.query($render, function (error, result) {
        $App.render(response, 'tests-view', {'rows': result, 'points': $points});
    });
});

app.get('/results-list', function (req, response, next) {
    var $user = req.query.user;
    var $test = req.query.test;

    $render = "select sum(points) as bodu from tests left join questions using(id_test) where id_test = '" + $test + "' group by id_test";

    var $test_res = '';

    connection.query($render, function (error, result) {
        $test_res = result;

        $query = "select * from results where id_test = '" + $test + "' and id_user = '"+$user+"' group by id_test";
        connection.query($query,function (error, result) {

            var $done = result[0].splnen == 'true';

            $App.render(response, 'tests-result', {'testresult': '<p>Počet bodů: ' + result[0].points + '</p><p>Test ' + ($done ? 'byl splněn.' : 'nebyl splněn.') + '</p>'});
        });

    });
});

app.get('/start-test', function (req, response, next) {
    var $id_test = req.query.id_test;
    var $points = 0;

    $render = "select id_test, name as nazev, count(question_name) as otazek,sum(points) as bodu from tests left join questions using(id_test) where id_test = '" + $id_test + "' group by id_test";
    connection.query($render, function (error, result) {
        $points = result[0].bodu;
    });

    $render = "SELECT * FROM tests left join questions using(id_test) left join answer using(id_question) where id_test = '" + $id_test + "'";
    var $query = connection.query($render, function (error, result) {
        $App.render(response, 'tests-view', {'rows': result, 'points': $points});
    });
});

app.get('/logout', function (req, response, next) {
    $App.logged = false;
    $App.render(response, 'login');
});

//app.get('/expired-test', function (req, response, next) {
//    $App.render(response, 'error-page',{error: 'Časový limit vypršel <button onclick="window.location = \'/testslist\';" class="btn-basic">Zpět na přehled testů</button>'});
//});

app.post('/submit-test', function (req, response, next) {
    var $id_test = req.body.id_test;

    $render = "SELECT * FROM tests left join questions using(id_test) left join answer using(id_question) where id_test = '" + $id_test + "'";
    var $query = connection.query($render, function (error, result) {
        var $points = 0;
        var $skip = false;
        var $right = 0;
        var $current = result[0];
        var $fine = 0;
        var $answered = false;


        for ($i in result) {
            $elem = result[$i];


            if ($current.id_question != $elem.id_question) {
                if (!$answered) {
                    $skip = $elem.id_question;
                    log('otazka nezodpovezena: ' + $current.question_name);
                } else {
                    if ($fine) {
                        log('V poradku: ' + $current.question_name);
                        $points += $current.points;
                        $right++;
                    } else {
                        log('Spatne: ' + $current.question_name);
                    }
                }
                $current = $elem;
                $skip = false;
                $fine = false;
                $answered = false;
            }

            if ($skip != $elem.id_question) {
                $skip = false;
                $fine = true;
                var $found = false;
                //log('--------- Searching: ' + $elem.answer);
                for (var param in req.body) {
                    if (param.indexOf('check') != -1) {
                        $question = param;
                        $id_question = $question.substring(5, $question.indexOf('-'));
                        $id_answ = $question.substring($question.indexOf('-') + 1);

                        if ($id_question == $elem.id_question) {
                            $answered = true;
                            if ($elem.id_answer == $id_answ) {
                                $found = true;
                                $fine = $elem.correct == 'true';
                                //log($fine + ' -> ' + $elem.answer);
                                if (!$fine)$skip = $elem.id_question;
                            }

                        }
                    }
                }
                if(!$found && $elem.correct == 'true'){
                    $fine = false;
                    $skip = $elem.id_question;
                }

            }
        }

        if (!$answered) {
            log('otazka nezodpovezena: ' + $current.question_name);
        } else {
            if ($fine) {
                log('V poradku: ' + $current.question_name);
                $points += $current.points;
            } else {
                log('Spatne: ' + $current.question_name);
            }
        }

        $render = "select id_test, name as nazev, count(question_name) as otazek,sum(points) as bodu from tests left join questions using(id_test) where id_test = '" + $id_test + "' group by id_test";
        connection.query($render, function (error, result) {
            var $done = (($points / parseInt(result[0].bodu)) * 100) >= 60;
            log('Pocet bodu: ' + $points + '/' + result[0].bodu + ' {' + $done + '}');

            $result = "INSERT INTO `silar`.`results` (`id_result`, `id_user`, `id_test`, `points`,`splnen`) VALUES (NULL, ?, ?, ?, ?)";
            connection.query($result,[$App.user_id,$id_test,($points + '/' + result[0].bodu),$done ? 'true' : 'false'], function (error, result) {});

            $App.render(response, 'tests-result', {'testresult': '<p>Počet bodů: ' + $points + '/' + result[0].bodu + '</p><p>Test ' + ($done ? 'byl splněn.' : 'nebyl splněn.') + '</p>'});
        });
    });
});



server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});