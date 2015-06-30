module.exports = (function() {
    "use strict";
    var _self;
    function UserMgr() {
        _self = this;
        _self.reset();
    }

    UserMgr.prototype.reset = function() {
        _self.users = {};
        _self.init = false;
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


