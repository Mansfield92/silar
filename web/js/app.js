/**
 * Created by Neo on 05.12.2015.
 */
/**
 * Created by Neo on 17.11.2015.
 */
var $App = $App || {};

$App.maxQuestions = 20;
$App.maxAnswers = 4;


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

$App.customCheckbox = function(){
    $('.question-row input:checkbox').each(function(){
        $(this).customInput();
    });
    //$('.testform')[0].reset();
    if($('#testform').length){
        document.getElementById("testform").reset();
    }
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
            var $answer = '<div class="add_form__answers answer"><input type="text" placeholder="Odpověď" value="" name="answer' + $id + '-' + $ans + '">' +
                '<input class="checkbox" type="checkbox" name="right' + $id + '-' + $ans + '" id="right' + $id + '-' + $ans + '"><label for="right' + $id + '-' + $ans + '">Správná odpověď</label></div>';
            $($answer).insertBefore(this).hide().fadeIn(500);
            $App.checkbox();
            if($ans == ($App.maxAnswers-1))
                $(this).remove();
        }else{
            $before = $(this).parent().find('.question:last').find('input:first-of-type').attr('name');
            $id = $before.substr($before.indexOf('question')+8);
            $id++;

            var $question = '<div class="add_form__row question"><label>Název otázky {'+(parseInt($id)+1)+'}</label>' +
                '<input type="text" placeholder="Název otázky" value="" name="question'+$id+'"></div><div class="add_form__row">' +
                '<label>Počet bodů</label><input type="number" placeholder="Počet bodů" value="" name="points'+$id+'"></div>' +
                '<div class="add_form__answers answer"><input type="text" placeholder="Odpověď" value="" name="answer'+$id+'-0">' +
                '<input class="checkbox" type="checkbox" name="right'+$id+'-0" id="right'+$id+'-0"><label for="right'+$id+'-0">Správná odpověď</label></div>' +
                '<button class="btn-basic center-block ajax-action" data-action="new-answer">Přidat další odpověď</button>' +
            '<div class="add_form__splitter">&nbsp;</div>';
            $($question).insertBefore(this).hide().fadeIn(500);
            $App.testForm();
            if($id == ($App.maxQuestions-1)){
                $(this).prev().remove();
                $(this).remove();
            }

        }
        //log($(this).data('action'));
    });
};

$App.initSearch = function () {
    $('#search').keyup(function(){
        var valThis = $(this).val().toString();
        valThis = valThis.toLowerCase();
        $('.tests-list_item:not(.tests-list_item-header), .users-list_item').each(function(){
            var text = $(this).data('search').toString();
            text = text.toLowerCase();
            if(text.indexOf(valThis) != -1){
                $(this).show();
            }else{
                $(this).hide();
            }
        });
    });
};

$App.testForms = function(){
    log($('.add_form').find('form').serialize());
};

$App.deleteTest = function(){
    $('.delete-test').click(function(event) {
        event.preventDefault();
        var r=confirm("Opravdu chcete smazat tento test?");
        if (r==true)   {
            window.location = $(this).attr('href');
        }
    });
    $('.delete-user').click(function(event) {
        event.preventDefault();
        var r=confirm("Opravdu chcete smazat tohoto uživatele?");
        if (r==true)   {
            window.location = $(this).attr('href');
        }
    });
    $('.delete-result').click(function(event) {
        event.preventDefault();
        var r=confirm("Opravdu chcete smazat tento výsledek testu?");
        if (r==true)   {
            window.location = $(this).attr('href');
        }
    });
};

$App.hideTime = function(){

    if($('.hide-time').length) {

        $('.hide-time').click(function () {
            if ($(this).is('.rotated')) {
                $(this).removeClass('rotated');
                $('.remaining-time').removeClass('behind');
            } else {
                $(this).addClass('rotated');
                $('.remaining-time').addClass('behind');
            }
        });

        $App.testTime = parseInt($('.timer').html());

        $('.timer').html($App.testTime + ':00');
        $App.testTime = $App.testTime * 60;

        setTimeout(function () {
            decreaseTime();
        }, 1000);
    }
};

function decreaseTime(){
    $App.testTime = $App.testTime-1;
    var minutes = parseInt($App.testTime/60);
    var seconds = $App.testTime%60;

    if($App.testTime == 0){
        var $name = $('input[name="id_test"]').val();
        window.location = '/expired-test?id_test='+$name;
    }else {
        //log(minutes + ':' + seconds);
        $('.timer').html(minutes + ':' + seconds);

        if(minutes < 1){
            if(seconds == 59){
                $('.remaining-time').addClass('warning');
            }
            $('.hide-time').removeClass('rotated');
            $('.remaining-time').removeClass('behind');
        }

        setTimeout(function () {
            decreaseTime();
        }, 1000);
    }
}

$App.init = function(){
    $App.resize();
    $App.testForm();
    $App.initSearch();
    $App.deleteTest();
    $App.hideTime();
    $App.customCheckbox();
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
