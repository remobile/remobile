var _  = require('underscore');

module.exports = (function() {
    "use strict";
    function LoginMgr() {
    }

    LoginMgr.prototype.login = function(userid, password, autoLogin, remeberPassword) {
        if (!app.chatconnect) {
            app.toast('chat server not connected');
            return;
        }
        var reconnect = !userid;
        if (!reconnect) {
            this.userid = userid;
            this.password = password;
            this.autoLogin = autoLogin;
            this.remeberPassword = remeberPassword;
        } else {
            userid = this.userid;
            password = this.password;
        }
        if (!userid || !password) {
            console.log("reconnect without user");
            return;
        }
        var param = {
            userid: userid,
            password: password,
            reconnect: reconnect
        };
        this.reconnect = reconnect;
        app.showWait("login...");
        app.socket.emit('USER_LOGIN_RQ', param);
    };
    LoginMgr.prototype.onLogin = function(obj) {
        console.log(obj);
        app.hideWait();
        if (obj.error) {
              app.showChatError(obj.error);
              return;
        }
        if (!this.reconnect) {
            var us = app.us;
            var constants = app.constants;
            var userid = obj.userid;
            us.string(constants.LOGIN_USER_ID, userid);
            if (this.remeberPassword) {
                us.string(constants.LOGIN_PASSWORD, obj.password);
            } else {
                us.string(constants.LOGIN_PASSWORD, '');
            }
            us.bool(constants.LOGIN_AUTO_LOGIN, this.autoLogin);
               var option = {
                indexes: [{name:"time", unique:false}]
                ,capped: {name:"time", max:1000, direction:1, strict:true}
            };
            app.db_history_message = indexed('history_message_'+userid).create(option);
            app.db_newest_message = indexed('newest_message_'+userid).create();
            app.db_user_head = indexed('user_head_'+userid).create();
            app.db_user_head.find(function (err, docs) {
                _.each(docs, function (doc) {
                    $.insertStyleSheet(app.userHeadCss, '.user_head_' + doc.userid, 'background-image:url(' + doc.head + ')');
                });
            });
        }
        app.socket.emit('USER_LOGIN_SUCCESS_NFS');
        this.online = true;
        app.messageMgr.getNewestMessage();
        app.showView('home', 'fade', null, true);
    };
    LoginMgr.prototype.onRegister = function(obj) {
        console.log(obj);
        if (obj.error) {
          app.showChatError(obj.error);
          return;
        }
        app.toast("Register Success");
        app.goBack();
    };

    return new LoginMgr();
})();


