'use strict';
// Server-side Code
//


var libSms = require('../../lib/sms_verify');

// Define actions which can be called from the client using ss.rpc('demo.ACTIONNAME', param1, param2...)
exports.actions = function(req, res, ss) {
    req.use('session');

    //  req.session.channel.subscribe('vchat');
    //req.use('example.authenticated')

    return {
        getUsrId: function(){
            res(req.session.name);
        }, // getUsrId()

        login: function(name){
            if (!name || name.length <= 0) {
                return res(false);
            };
            req.session.setUserId(name);
            req.session.name = name;
            req.session.save();
            res(true);
        }, // login()

        logout: function(){
            req.session.setUserId(null);
            req.session.name = null;
            req.session.save();
            res('0');
        },

        sendMessage: function(msg) {
            if (!msg || !msg.data) { return res(false); }
            msg.sender = req.session.name;
            ss.publish.all('newMsg', msg);
            return res(true);
        },

        smsSend: function(phone){
            if (!phone || !phone.match(/\d{11}/g)) {
                console.log('demo.sendSend`手机号错误!');
                return res(false);
            };
            libSms.send(phone, function(err, succ){
                res(!err && succ);
            });
        }, // smsSend

        smsVerify: function(vobj){
            if (!vobj || !vobj.code || !vobj.code.match(/\d{6}/g) || !vobj.phone || !vobj.phone.match(/\d{11}/g)) {
                console.log('demo.smcVerify`手机号/验证码错误!');
                return res(false);
            };
            libSms.verify(vobj.code, vobj.phone, function(err, succ){
                if(!err && succ){
                    req.session.setUserId(vobj.phone);
                    req.session.name = vobj.phone;
                    req.session.save();
                    return res(true);
                }
                res(false);
            });
        }, // smsVerify()
    };
};
