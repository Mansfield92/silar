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
    $('.ajax-action').unbind('click').bind('click',function(e){
        e.preventDefault();
        var $action = $(this).data('action');
        if($action.indexOf('answer') != -1){
            var $before = $($(this).context.previousElementSibling);
            var $id = $before.find('input:first-of-type').attr('name');
            var $ans = $id.substr($id.indexOf('-')+1);
            $id = $id.substring($id.indexOf('answer')+6,$id.indexOf('-'));
            $ans++;
            if($ans < 4) {
                var $answer = '<div class="add_form__answers answer"><input type="text" placeholder="Odpověď" value="" name="answer' + $id + '-' + $ans + '">' +
                    '<input class="checkbox" type="checkbox" name="right' + $id + '-' + $ans + '" id="right' + $id + '-' + $ans + '"><label for="right' + $id + '-' + $ans + '">Správná odpověď</label></div>';
                $($answer).insertBefore(this).hide().fadeIn(500);
                $App.checkbox();
                if($ans == 3)
                    $(this).remove();
            }
        }else{
            $before = $(this).parent().find('.question:last').find('input:first-of-type').attr('name');
            $id = $before.substr($before.indexOf('question')+8);
            $id++;

            var $question = '<div class="add_form__row question"><label>Název otázky</label>' +
                '<input type="text" placeholder="Název otázky" value="" name="question'+$id+'"></div><div class="add_form__row">' +
                '<label>Počet bodů</label><input type="number" placeholder="Počet bodů" value="" name="points'+$id+'"></div>' +
                '<div class="add_form__answers answer"><input type="text" placeholder="Odpověď" value="" name="answer'+$id+'-0">' +
                '<input class="checkbox" type="checkbox" name="right'+$id+'-0" id="right'+$id+'-0"><label for="right'+$id+'-0">Správná odpověď</label></div>' +
                '<button class="btn-basic center-block ajax-action" data-action="new-answer">Přidat další odpověď</button>' +
            '<div class="add_form__splitter">&nbsp;</div>';
            $($question).insertBefore(this).hide().fadeIn(500);
            $App.testForm();

        }
        //log($(this).data('action'));
    });
};

$App.testForms = function(){
    log($('.add_form').find('form').serialize());
};

$App.init = function(){
    $App.resize();
    $App.testForm();
    $('.btn-test').click(function(e){
        e.preventDefault();
    });
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