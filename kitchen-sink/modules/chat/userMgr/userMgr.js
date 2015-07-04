module.exports = (function() {
    "use strict";
    var _self;
    function UserMgr() {
        _self = this;
        _self.reset();
    }

    UserMgr.prototype.reset = function() {
        _self.users = {};
        _self.me = {};
        _self.init = false;
    };
    UserMgr.prototype.login = function(userid, password, autoLogin, remeberPassword) {
        if (!app.chatconnect) {
            app.toast('chat server not connected');
            return;
        }
        var reconnect = !userid;
        if (!reconnect) {
            _self.me.userid = userid;
            _self.me.password = password;
            _self.me.autoLogin = autoLogin;
            _self.me.remeberPassword = remeberPassword;
        } else {
            userid = _self.me.userid;
            password = _self.me.password;
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
        _self.me.reconnect = reconnect;
        app.showWait("login...");
        app.socket.emit('USER_LOGIN_RQ', param);
    };
    UserMgr.prototype.onLogin = function(obj) {
        app.hideWait();
        if (obj.error) {
              app.showChatError(obj.error);
              return;
        }
        if (!_self.me.reconnect) {
            var us = app.us;
            var constants = app.constants;
            us.string(constants.LOGIN_USER_ID, obj.userid);
            if (_self.me.remeberPassword) {
                us.string(constants.LOGIN_PASSWORD, obj.password);
            } else {
                us.string(constants.LOGIN_PASSWORD, '');
            }
            us.bool(constants.LOGIN_AUTO_LOGIN, _self.me.autoLogin);
        }
        _self.me.online = true;
        app.showView('home', 'fade', null, true);
    };
    UserMgr.prototype.add = function(obj) {
        var users = _self.users;
        var userid = obj.userid;
        if(!users.hasOwnProperty(userid)) {
            users[userid] = obj;
            if (app.uiContact) {
                app.uiContact.showUserList();
            }
        }
    };
    UserMgr.prototype.addList = function(list) {
        var users = _self.users;
        for (var i in list) {
            var userid =list[i].userid;
            if(!users.hasOwnProperty(userid)) {
                users[userid] = list[i];
            }
        }
        if (app.uiContact) {
            app.uiContact.showUserList();
        }
        _self.init = true;
    };
    UserMgr.prototype.getUseridByUsername = function(username) {
        var users = _self.users;
        for (var id in users) {
            var user = users[id];
            if (username == user.username) {
                return id;
            }
        }
        return null;
    };
    UserMgr.prototype.updateHead = function(head) {
        app.emit('USERS_UPDATE_HEAD_RQ', {head:head});
    };
    UserMgr.prototype.updateUserInfo = function(username, phone, sign) {
        app.emit('USERS_UPDATE_USERINFO_RQ', {username:username, phone:phone, sign:sign});
    };
    UserMgr.prototype.onUpdateUserInfoNotify = function(obj) {
        console.log(obj);
        var users = _self.users;
        var userid = obj.userid;
        if(users.hasOwnProperty(userid)) {
            users[userid].username = obj.username;
            users[userid].phone = obj.phone;
            users[userid].sign = obj.sign;
            app.color.updateUserName(userid, obj.username);
        }
    };

    return new UserMgr();
})();


