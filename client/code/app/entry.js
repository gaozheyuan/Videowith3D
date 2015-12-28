'use strict';
// This file automatically gets called first by SocketStream and must always exist

// Make 'ss' available to all modules and the browser console
window.ss = require('socketstream');

window.hide_login = function(){
    on_logined();
} // hide_login()

ss.server.on('disconnect', function(){
    console.log('Connection down :-(');
});
ss.server.on('reconnect', function(){
    console.log('Connection back up :-)');
});

function init_logout(){
    $('#logout').show();
}

function show_login(){
    $('#userId').html('');
    $('#chat-input').hide();
    $('#logout').hide();
    $('#chat-foot').html(ss.tmpl['chat-foot_login'].render());
    init_login_btn();
} // show_login()


var _wb = require('/auth_conf');
ss.server.on('ready', function(){
    jQuery(function(){
        var chat = require('/chat');
        window.skip_login = function(){
            $('#chat-input').show();
            $('#chat-foot').html(ss.tmpl['chat-foot_send'].render());
            chat.initBtns();
        };
        window.on_logined = function(){
            ss.rpc('demo.getUsrId', function(uid){
                if (!uid) { 
                    return show_login(); 
                }
                $('#userId').html(uid);
                $('#chat-foot').html(ss.tmpl['chat-foot_send'].render());
                skip_login();
                init_logout();
            });
        };
        on_logined();

        window.init_login_btn = function(){
            $("#login-weibo").click(function(){
                var url = _wb.URL + _wb.KEY + '&redirect_uri=' + _wb.REDIRECT_URI + '&response_type=' + _wb.RESPONSE_TYPE;
                window.open(url , "", 'height=600, width=768, left=100 ,top= 100');
            });
            $('#send_sms').click(function(){
                var phone = $('#id-phone').val();
                if (!chk_phone(phone)) { return; };
                var start = 120;
                var x = setInterval(function(){
                    start--;
                    if (start <= 0 ) {
                        clearInterval(x);
                        x = null;
                        $('#send_sms').html('获取验证码');
                        $('#send_sms').attr('disabled', false);
                        return;
                    };
                    $('#send_sms').html(start+ '秒后重新发送');
                }, 1000);
                $('#send_sms').attr('disabled', true);
                ss.rpc('demo.smsSend', phone, function(succ){
                    if (!succ) { alert('发短信失败，请稍候再试!'); };
                });
            });

            $('#verify').click(function(){
                var phone = $('#id-phone').val();
                if (!chk_phone(phone)) { return; };
                var code = $('#id-code').val();
                if (!chk_code(code)) { return; };
                ss.rpc('demo.smsVerify', {code: code, phone: phone}, function(succ){
                    if (!succ) { alert('短信验证失败'); };
                    on_logined();
                });
            });
        } // init_login_btn()
    });

    function chk_code(code){
        if (!code) {
            alert('验证码不能为空');
            return false;
        };
        if (!code.match(/\d{6}/g)) {
            alert('请输入正确的验证码!');
            $('#id-code').val('');
            return false;
        };
        return true;
    } // chk_code()

    function chk_phone(phone){
        if (!phone) {
            alert('手机号不能为空');
            return false;
        };
        if (!phone.match(/\d{11}/g)) {
            alert('请输入正确的手机号!');
            $('#id-phone').val('');
            return false;
        };
        return true;
    } // chk_phone()
});
