/**
 * Created by Neo on 05.12.2015.
 */
/**
 * Created by Neo on 17.11.2015.
 */
var $App = $App || {};


$App.getAjaxData = function (target, data) {
    if (typeof(data) === 'undefined') {
        data = {view: target};
    }
    var getData = $.ajax({
        type: 'POST',
        url: target,
        data: data,
        success: function (data) {
            getData = data;
        },
        async: false,
        timeout: 5000,
        global: false
    }).responseText;
    return getData;
};

$(function(){
    $('#btn').click(function() {
        alert($App.getAjaxData('/test',{data:'neco',bagr:'lopate',veverka:'sysel'}));
    });
});

$App.logout = function(){
    $.ajax({type: 'POST',url: '/logout',data:'logout',success: function (data) {F5();}});
};

//$App.getUser = function(){
//    $.ajax({type: 'GET',url: '/username',success: function (data) {
//        $('.user-panel-text').html(data);
//    }});
//};

$App.init = function(){
    //$App.getUser();
};

$( document ).ready(function() {
    $("#loader").center();
    $App.init();
    destroy_loader();
});