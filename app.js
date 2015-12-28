var ss = require('socketstream');
var redirect = require('connect-redirection');
var everyauth = require('everyauth');
var url = require('url');

require('./lib/load');
var conf = global._app.conf;

ss.http.middleware.prepend(require('body-parser').urlencoded());

// App's main http entrance
ss.client.define('main', {
    view: 'app.html',
    css: ['chat-1.css'],
    code: [ 
//        '../node_modules/es6-shim/es6-shim.js', 'libs/jquery.min.js', 
        '../node_modules/es6-shim/es6-shim.js',
        'libs/damoo.js', '../conf/conf.js', 'app'
    ],
    tmpl: 'chat'
});
ss.http.route('/', function(req, res){ res.serveClient('main'); });

ss.client.templateEngine.use(require('ss-hogan'));


// OAuth - Weibo
ss.http.route('/auth/weibo_cb', require('./lib/auth_wb').on_cb);

// OAuth - Twitter
var auth_twitter = conf.oauth.twitter;
everyauth.twitter
  .consumerKey(auth_twitter.KEY)
  .consumerSecret(auth_twitter.SEC)
  .findOrCreateUser( function (session, accessToken, accessTokenSecret, twitterUserMetadata) {
    var userName = twitterUserMetadata.screen_name;
    console.log('Twitter Username is', userName);
    session.userId = userName;
    session.name = userName;
    session.save();
    return true;
  })
  .redirectPath('/');
ss.http.middleware.append(everyauth.middleware());

if (ss.env === 'production') ss.client.packAssets();

ss.start();
