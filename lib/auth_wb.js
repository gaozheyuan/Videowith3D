/**
 * midlleware for weibo login
 *
 */
var request = require('request');
var util = require('util');
var url = require('url');

var auth_wb = global._app.conf.oauth.weibo;
var conf_http = global._app.conf.http;

var OAuth = require('./OAuth');
var _wb = new OAuth.Weibo({
    client_id : auth_wb.KEY,
    app_key : auth_wb.KEY,
    app_secret : auth_wb.SEC,
    redirect_uri : 'http://' + conf_http.host + auth_wb.CB_URL
});

var cb_tpl = '<!DOCTYPE html><html> <head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>U see Web</title> </head> <body> <script> %s window.close(); </script> </body> </html>';

function _on_cb_err(res, msg){
    return res.end(util.format(cb_tpl, 'alert("' + msg + '");'));
}

var exp = {};
exp.on_cb = function(req, res){
    var qs_dic = url.parse(req.url, true).query;
    _wb.oauth.accesstoken(qs_dic.code , function (error, data){
        if(error){ return _on_cb_err(res, '您取消了授权！'); }

        var uid = req.session.userId = data.uid;
        var acc_token = req.session.wb_acc_token = data.access_token;
        req.session.save();

        console.log('uid=%s`acc_token=%s', data.uid, data.access_token);

        _wb.users.show({
            source: auth_wb.KEY,
            uid: uid,
            access_token: acc_token,
            method: "GET"
        }, function(err, data){
            console.dir(err);
            req.session.name = uid;
            req.session.save();
            if(err){ 
                return res.end(util.format(cb_tpl, 'if (window.opener){window.opener.on_logined();}'));
            }
            console.log('name=%s', data.name);
            req.session.name = data.name;
            req.session.save();

            return res.end(util.format(cb_tpl, 'if (window.opener){window.opener.on_logined();}'));
        });
    });
}; // on_cb()

module.exports = exp;
