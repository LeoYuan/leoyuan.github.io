define(function(require, exports, module) {
    var cookieUtil = require('./cookie');
    var $cookieName = $('#cookieName'), $cookieValue = $('#cookieValue'), $cookieExpires = $('#cookieExpires');

    function addPlaceholder(el) {
        var placeholder = el.attr('placeholder');
        if (!("placeholder" in document.createElement("input"))) {
            el.addClass('cookie-input-empty');
            el.val(placeholder);
            el.focus(function() {
                if ($(this).val() === placeholder) {
                    el.removeClass('cookie-input-empty');
                    el.val('');
                }
            });
            el.blur(function() {
                if (!$(this).val()) {
                    el.addClass('cookie-input-empty');
                    el.val(placeholder);
                }
            });
        }
    }

    function initUI() {
        $cookieName.focus();

        var persistentCookies = cookieUtil.getAllCookies();
        for (var cookieName in persistentCookies) {
            addView(cookieName, persistentCookies[cookieName], 'whatever');
        }
    }

    function bindEvents() {
        $('#add').click(addHandler);

        // $(document).keydown(function(ev) {
        //     if (ev.keyCode === 13) {
        //         addHandler.call();
        //         console.log('keydown')
        //     }
        // });
    }

    function addHandler() {
        var cookieName = $cookieName.val() === $cookieName.attr('placeholder') ? '' : $cookieName.val();
        var cookieValue = $cookieValue.val() === $cookieValue.attr('placeholder') ? '' : $cookieValue.val();
        var expires = $cookieExpires.val() === $cookieExpires.attr('placeholder') ? '' : $cookieExpires.val();

        cookieUtil.setCookie(cookieName, cookieValue, expires);
        addView(cookieName, cookieValue, expires);
    }

    function addView(cookieName, cookieValue, expires) {
        $cookieName.val('');
        $cookieName.blur();
        $cookieValue.val('');
        $cookieValue.blur();
        $cookieExpires.val('');
        $cookieExpires.blur();

        // persistent cookie
        // if (!expires) {
        //     if (!$('.cookie-session ul').length) {
        //         $('.cookie-session').empty();
        //         $('<ul>').appendTo($('.cookie-session'));
        //     } 
        //     $('.cookie-session ul').append($('<li>' + cookieName + ' = ' + cookieValue + '</li>'));
        // } else {
        //     if (!$('.cookie-persistent ul').length) {
        //         $('.cookie-persistent').empty();
        //         $('<ul>').appendTo($('.cookie-persistent'));
        //     } 
        //     $('.cookie-persistent ul').append($('<li>' + cookieName + ' = ' + cookieValue + '</li>'));
        // }
        if (!$('.cookie-persistent ul').length) {
            $('.cookie-persistent').empty();
            $('<ul>').appendTo($('.cookie-persistent'));
        } 
        $('.cookie-persistent ul').append($('<li>' + cookieName + ' = ' + cookieValue + '</li>'));
    }

    function delView() {

    }

    (function init() {
        addPlaceholder($cookieName);
        addPlaceholder($cookieValue);
        addPlaceholder($cookieExpires);
        initUI();
        bindEvents();
    })();
});