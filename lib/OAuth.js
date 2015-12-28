var querystring = require('querystring');
var _ = require("underscore");
var request = require('request');

var OAuth={};

OAuth.Weibo = function (options) {
    this.options = {
        app_key:null,
        app_secret:null,
        access_token:null,
        user_id:0,
        refresh_token:null,
        redirect_uri:"",
        api_group:[],
        scope:""
    };
    _.extend(this.options, options);
    this.oauth = this.oauth();
    this.users = this.users();
}

OAuth.Weibo.prototype.request = function (options, callback) {
    var self = this;
    var post_body = querystring.stringify(options);
    var opts = {
        host:"https://api.weibo.com/",
        path:'2/' + options.path + ".json",
        method:'POST',
        headers:{
            'content-type':'application/x-www-form-urlencoded'
        }
    };
    request({
        url:opts.host + opts.path + ((options.method == "GET") ? ("?" + post_body) : ""),
        method:options.method || "POST",
        headers:{ 'content-type':'application/x-www-form-urlencoded' },
        body:((options.method == "GET") ? "" : post_body)
    }, function (e, r, body) {
        if (!e) {
            try {
                body = JSON.parse(body);
                console.dir(body);
//                console.dir(e);
                if (body.error) {
                    e = new Error(body.error);
                }
            }
            catch (error) {
                e = error;
            }
        }
        callback && callback(e, body);
    });
};

OAuth.Weibo.prototype.oauth = function () {
    var self = this;
    return {
        authorize:function (options) {
            return  'https://api.weibo.com/oauth2/authorize?' + querystring.stringify(options);
        },
        accesstoken:function (code, callback) {
            var options = {
                grant_type:"authorization_code",
                code:code,
                client_id:self.options.app_key,
                client_secret:self.options.app_secret,
                redirect_uri:self.options.redirect_uri
            };
            var post_body = querystring.stringify(options);
            var opts = {
                url:'https://api.weibo.com/oauth2/access_token',
                method:'post',
                headers:{
                    "Content-Type":'application/x-www-form-urlencoded',
                    "Content-length":post_body ? post_body.length : 0
                },
                body:post_body
            };
            request(opts, function (e, r, body) {
                try {
                    body = JSON.parse(body);
                }
                catch (error) {
                    e = error;
                }

                if (body.error) {
                    e = new Error(body.error);
                }
                callback && callback(e, body);
            });
        }
    }
};

OAuth.Weibo.prototype.users = function () {
    var users = {};
    var self = this;
    var users_methods = ["show"];

    users_methods.forEach(function (method) {
        users[method] = function (options, callback) {
            options.path = "users/" + method;
            self.request(options, callback);
        }
    });
    return users;
};

//QQ
OAuth.QQ = function (options) {
    this.options = {
        app_key:null,
        app_secret:null,
        access_token:null,
        user_id:0,
        refresh_token:null,
        format:"JSON",
        redirect_uri:"",
        api_group:[],
        scope:""
    };
    _.extend(this.options, options);

    this.oauth = this.oauth();
    this.users = this.users();
}

OAuth.QQ.prototype.request = function (options, callback) {
    var self = this;
    var post_body = querystring.stringify(options);
    request({
        url:'https://graph.qq.com' + options.path + ((options.method == "GET") ? ("?" + post_body) : ""),
        method:options.method || "POST",
        headers:{
            "Content-Type":'application/x-www-form-urlencoded'
        },
        body:((options.method == "GET") ? "" : post_body)
    }, function (e, r, body) {
        if (!e) {
            try {
                body = JSON.parse(body);
                if (body.error) {
                    e = new Error(body.error);
                }
            }
            catch (error) {
                e = error;
            }
        }
        callback && callback(e, body);
    });
};

OAuth.QQ.prototype.oauth = function () {
    var self = this;
    return {
        authorize:function (options) {
            return  'https://graph.qq.com/oauth2.0/authorize?' + querystring.stringify(options);
        },
        accesstoken:function (code, callback) {
            var options = {
                grant_type:"authorization_code",
                code:code,
                client_id:self.options.client_id,
                client_secret:self.options.app_key,
                redirect_uri:self.options.redirect_uri
            };

            var post_body = querystring.stringify(options);
            var opts = {
                url:"https://graph.qq.com/oauth2.0/token",
                method:'POST',
                headers:{
                    "Content-Type":'application/x-www-form-urlencoded'
                },
                body:post_body
            };
            request(opts, function (e, r, body) {
                callback && callback(e, body);
            });
        },
        openid:function (token, callback) {
            var options = {
                access_token:token
            };
            var opts = {
                url:"https://graph.qq.com/oauth2.0/me",
                method:'POST',
                headers:{
                    "Content-Type":'application/x-www-form-urlencoded'
                },
                body:querystring.stringify(options)
            };
            request(opts, function (e, r, body) {//MIND body is: callback( {"client_id":"YOUR_APPID","openid":"YOUR_OPENID"} );
                if (!e) {
                    try {
                        body = JSON.parse(body.substring(body.lastIndexOf('{'), body.lastIndexOf('}') + 1));
                    }
                    catch (error) {
                        e = error;
                    }
                }
                callback && callback(e, body);
            })
        }
    }
};

OAuth.QQ.prototype.users = function () {
    var user = {};
    var self = this;
    var user_methods = ['get_user_info'];

    user_methods.forEach(function (m) {
        user[m] = function (options, callback) {
            options.path = "/user/" + m;
            self.request(options, callback);
        }
    });
    return user;
};

module.exports = OAuth;
