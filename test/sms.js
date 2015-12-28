require('../lib/load');
var sms = require('../lib/sms_verify');

var phone = '13242703214';

/**
sms.send(phone, function(){
    console.log('=========== CALLER ===========');
    console.dir(arguments);
});
*/

sms.verify('761687', phone, function(){
    console.log('=========== verify ===========');
    console.dir(arguments);
});
