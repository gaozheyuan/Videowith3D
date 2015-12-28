'use strict';
var http = { 
    host: 'uc.4377.me',
    port: 3000
};

var conf = {
    http: http,
    oauth: {
        twitter: {
            KEY: 'jO4fjIYMXFm2FHpofifEhGxt9',
            SEC: 'lwkf64E7q4RaTmmAWAJS2Lwcppn8MEx8jspIzjYe9wZlcCpgoW',
        },
        weibo: {
            KEY : '2561428576',
            SEC : 'fc8e1d40ac75c6b6712ef0e0c3ed62f1',
            CB_URL : '/auth/weibo_cb',
        },
        /**
        weibo: {
            client_id : '2561428576',
            app_key : '2561428576',
            app_secret : 'fc8e1d40ac75c6b6712ef0e0c3ed62f1',
            redirect_uri : 'http://uc.4377.me/auth/weibo_cb'
        },
        */
    },
};
module.exports = conf;
