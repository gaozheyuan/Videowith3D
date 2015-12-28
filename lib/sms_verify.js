var _req = require('request');
var util = require('util');

var _conf = global._app.sysConf.LEANCOULD;
module.exports = exp = {};

/**
 * Send sms by phone number.
 *
 * callback arguments: 
 * cb(err, succ)
 */
exp.send = function(phone, cb){
    _req({
        url: _conf.HOST + '/1.1/requestSmsCode',
        json: true,
        method: 'POST',
        headers: {
            'X-LC-Id': _conf.ID,
            'X-LC-Key': _conf.KEY,
        },
        body: {
            mobilePhoneNumber: phone
        }
    }, function(err, res, body){
        if (err) { 
            console.error(err);
            return cb(err, false); 
        };
        if (body.code && body.code != 200) {
            console.log('lib/sms_verify.send`FAILED`%s', JSON.stringify(body));
            return cb(null, false);
        };
        cb(null, true);
    });
} // sendSms()

/**
 * verify sms code by phone number and code.
 *
 * callback arguments: 
 * cb(err, succ)
 */
exp.verify = function(code, phone, cb){
    _req({
        url: util.format('%s/1.1/verifySmsCode/%s?mobilePhoneNumber=%s', 
                 _conf.HOST, code, phone),
        json: true,
        method: 'POST',
        headers: {
            'X-LC-Id': _conf.ID,
            'X-LC-Key': _conf.KEY,
        },
    }, function(err, res, body){
        if (err) { 
            console.error(err);
            return cb(err, false); 
        };
        if (body.code && body.code != 200) {
            console.log('lib/sms_verify.verify`FAILED`%s', JSON.stringify(body));
            return cb(null, false);
        };
        cb(null, true);
    });
} // sendSms()
