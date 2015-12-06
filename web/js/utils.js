
function utils(){}

$(function () {
    $.fn.center = function () {
        this.css("position", "absolute");
        this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop() / 2) + "px");
        this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
        return this;
    };
    $.fn.centerLoader = function () {
        this.css("position", "fixed");
        this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2)) + "px");
        this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) ) + "px");
        return this;
    };
    $.fn.centerTop = function () {
        this.css("marginTop", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop() / 2) + "px");
        return this;
    };
});

function logout() {
    $.post('#', {logout: true}, function (data) {
        F5();
    });
}

function log(msg) {
    console.log(msg);
}

function F5() {
    window.location.reload(true);
}

function destroy_loader() {
    $("#loader").hide();
    $("#loader_back").fadeOut('slow');
}

function show_loader() {
    $("#loader").centerLoader();
    $("#loader_back").show();
    $("#loader").show();
}

function loadingmessage(msg, show_hide) {
    if (show_hide == "show") {
        $('#uploaded_image').html('');
    } else if (show_hide == "hide") {
    } else {
        $('#uploaded_image').html('');
    }
}

function fullLenght(elem){
    elem = elem.toString();
    return elem.length == 1 ? ("0" + elem) : elem
}

function timestamp(){
    var d = new Date();
    var day = fullLenght(d.getDate());
    var month= fullLenght(d.getMonth() + 1);
    var year = d.getFullYear();
    var hours = fullLenght(d.getHours());
    var minutes = fullLenght(d.getMinutes());
    var seconds = fullLenght(d.getSeconds());
    return ("" + year+month+day+"_"+hours+minutes+seconds);
}

utils.confirmDialog = function(message,title){
    $('<div id="dialog">').appendTo('body');
    $('#dialog').html('').html('<p>' + message + '</p>');
    $("#dialog").dialog({
        modal: true,
        title: title,
        width: 'auto',
        draggable: true,
        buttons: {
            Ok: function () {
                utils.showDialog.removeDialog();
            },
            Cancel: function(){
                utils.showDialog.removeDialog();
            }
        },close: function (event, ui){
            utils.showDialog.removeDialog();
        }
    });
}

utils.showDialog = function(message, title, buttoned, dialog) {
    if (typeof(dialog) === 'undefined') dialog = true;
    if (typeof(buttoned) === 'undefined') buttoned = false;
    if (typeof(title) === 'undefined') title = "Message";
    $('<div id="dialog">').appendTo('body');
    if (dialog) {
        $('#dialog').html('').html('<p>' + message + '</p>');
        if (buttoned) {
            $("#dialog").dialog({
                modal: true,
                title: title,
                draggable: true,
                minWidth: 320,
                //width: 'auto',
                buttons: {
                    Ok: function () {
                        utils.showDialog.removeDialog();
                    }
                },close: function (event, ui){
                    utils.showDialog.removeDialog();
                }
            });
        } else {
            $("#dialog").dialog({
                modal: true,
                title: title,
                draggable: true,
                minWidth: 320,
                width: 'auto',close: function (event, ui){
                    utils.showDialog.removeDialog();
                }
            });
        }
    } else {
        alert(message);
    }
};
utils.showDialog.hideDialog = function(){
    $("#dialog").dialog();
    $("#dialog").dialog('destroy');
};
utils.showDialog.removeDialog = function(){
    $("#dialog").dialog('destroy').remove();
};