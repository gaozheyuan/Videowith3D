var conf = require('../../../conf/conf');
var wb_conf = conf.oauth.weibo;

var hostname = 'http://' + conf.http.host;
module.exports = {
    KEY: wb_conf.KEY,
    SEC: wb_conf.SEC,

    HOSTNAME: hostname,
    REDIRECT_URI: hostname + wb_conf.CB_URL,
    URL: 'https://api.weibo.com/oauth2/authorize?client_id=',
    RESPONSE_TYPE: 'code',
};
