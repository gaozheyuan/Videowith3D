'use strict';
var userId = '';

window.player = videojs('#video', {
    hls: { withCredentials: true }
});
player.play();


// ======= 弹幕初始化 =======
window.damoo = Damoo('player', 'dm-canvas', 20);
damoo.start();
damoo.hide();
$("#open-dammo").bootstrapSwitch();
$('#open-dammo').on('switchChange.bootstrapSwitch', function(event, state) {
    if (state) { damoo.show(); }
    else{ damoo.hide(); }
});

function switch_chann(src, type){
    player.src({ src:src, type:type });
    player.play();
} // switch_chann()

// ======= 切换视频源 =======
$('#play-rtmp').on('click', function(){
    switch_chann('rtmp://live.hkstv.hk.lxdns.com/live/hks', 'rtmp/flv');
});

$('#play-hls').on('click', function(){
    switch_chann('http://solutions.brightcove.com/jwhisenant/hls/apple/bipbop/bipbopall.m3u8', 'application/x-mpegURL');
});

$('#play-safari').on('click', function(){
    switch_chann('http://gslb.tv.sohu.com/live?cid=3&type=hls', 'application/x-mpegURL');
});

$('#play-local').on('click', function(){
    switch_chann('video/test1.mp4', 'video/mp4');
});

$('#play-local-live-rtmp').on('click', function(){
    switch_chann('rtmp://192.168.31.203/hls/test','rtmp/flv');
});

$('#play-local-live-http').on('click', function(){
    switch_chann('http://192.168.31.203/hls/test.m3u8','application/x-mpegURL');
});


$('#logout').hide();
$('#logout').on('click', function(){
    ss.rpc('demo.logout', on_logined);
});

// ======= 实时消息处理 =======
ss.event.on('newMsg', function(msg, chann) {
    onNewMsg(msg);
});


$('#chat-input').on('submit', function() {
    var text = $('#btn-input').val();
    return exports.send(text, false, false, function(success) {
        if (success) {
            return $('#btn-input').val('');
        }
        console.log('Oops! Unable to send message');
    });
});

exports.send = function(data, is_img, dammo, cb) {
    if (!valid(data)) {
        return cb(false);
    }
    return ss.rpc('demo.sendMessage', {data: data, is_img: is_img, dammo: dammo}, cb);
};


exports.initBtns = function(){
    $('#btn-chat-img').on('click', function(){
        $('#sendImage').click();
    });
    $('#btn-chat-dammo').on('click', function(){
        var text = $('#btn-input').val();
        return exports.send(text, false, true, function(success) {
            if (success) { return $('#btn-input').val(''); }
            console.log('Oops! Unable to send message');
        });
    });
    $('#sendImage').on('change', function(){
        if (this.files.length <= 0) { return; }
        var file = this.files[0], reader = new FileReader();
        if (!reader) {
            alert("Your browser doesn't support fileReader!");
            this.value = '';
            return;
        };
        reader.onload = function(e) {
            this.value = '';
            exports.send(e.target.result, true, false, function(succ){
                if (!succ) {
                    alert('Send img failed! Please try later...');
                };
            });
        };
        reader.readAsDataURL(file);
    });
    $('#btn-chat-clear').on('click', function(){
        $('#chat-room').html('');
    });
};

function onNewMsg(msg){
    if (msg.dammo) {
        return damoo.emit({
            text: msg.data,
            color: "#f00",
            shadow: { color: "#f49" }
        });
    };
    var tpl = msg.is_img ? 'chat-msg_img':'chat-msg';
//    var arrow = sender == 'me' ? 'right': 'left';
    var arrow = 'left';
    var html = ss.tmpl[tpl].render({
        userId: msg.sender,
        msg: msg.data,
        arrow: arrow,
        time: function() { return timestamp(); }
    });
    return $(html).hide().appendTo('#chat-room').slideDown();
} // onNewImg()



// Private functions

function timestamp() {
    var d = new Date();
    return d.getHours() + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
}

function pad2(number) {
    return (number < 10 ? '0' : '') + number;
}

function valid(text) {
    return text && text.length > 0;
}


window.login_hook = function(name){
    ss.rpc('demo.login', name, function(succ){
        if (succ) { userId = name; };
        on_logined();
    });
} // hide_login()
