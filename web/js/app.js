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


$App.centerGrid = function(){
    $grid = $('#grid');
    $grid.centerTop().css('marginTop',Math.max(0,parseInt($grid.css('marginTop'))-30) + "px");
};

$App.checkbox = function(){
    $('.add_form__answers input:checkbox').each(function(){
        $(this).button();
    });
};

$App.testForm = function(){
    $App.checkbox();
    $('.ajax-action').click(function(e){
        e.preventDefault();
        var $action = $(this).data('action');
        if($action.indexOf('answer') != -1){
            var $q = $action.substr($action.indexOf('%')+1);
            var $before = $($(this).context.previousElementSibling);
            var $id = $before.find('input:first-of-type').attr('name');
            var $ans = $id.substr($id.indexOf('answer')+6,$id.indexOf('-'));
            $id = $id.substr($id.indexOf('-')+1);
            //log($q);
            log('bagr');
            log($ans);
            log($id);
        }else{

        }
        //log($(this).data('action'));
    });
};

$App.init = function(){
    $App.resize();
    $App.testForm();
};

$App.resize = function(){
    $App.centerGrid();
};

$( document ).ready(function() {
    $("#loader").center();
    $App.init();
    destroy_loader();
});

$( window ).resize(function() {
    $App.resize();
});