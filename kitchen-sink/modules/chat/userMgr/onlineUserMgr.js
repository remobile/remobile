module.exports = (function() {
    "use strict";
    var _self;
    function OnlineUserMgr() {
        _self = this;
        _self.onlineUsers = {};
    }

    OnlineUserMgr.prototype.reset = function() {
        var onlineUsers = _self.onlineUsers;
        for (var userid in onlineUsers) {
            app.color.updateUserNameColor(userid, 'gray');
        }
        _self.onlineUsers = {};
    };
    OnlineUserMgr.prototype.add = function(obj) {
        var userid = obj.userid,
        onlineUsers = _self.onlineUsers;
        app.userMgr.add(obj);
        app.utils.playSound(app.resource.aud_login_tip);
        if(!onlineUsers.hasOwnProperty(userid)) {
            onlineUsers[userid] = obj;
            var onlineNum = Object.getOwnPropertyNames(onlineUsers).length;
            app.color.updateUserNameColor(userid, 'green');
            if (app.login.info && app.notifyon) {
                app.utils.toast(obj.username + "登陆了");
            }
            if (onlineNum) {
                console.log("now", onlineNum, "online");
            } else {
                console.log(" there is no person now");
            }
        } else {
            console.error(userid+" has multi");
        }
    };
    OnlineUserMgr.prototype.addList = function(list) {
        for (var i in list) {
            var obj = list[i];
            var userid = obj.userid,
            onlineUsers = _self.onlineUsers;
            if(!onlineUsers.hasOwnProperty(userid)) {
                onlineUsers[userid] = list[i];
            } else {
                console.error(userid+" has multi");
            }
        }
    };
    OnlineUserMgr.prototype.remove = function(obj) {
        var userid = obj.userid,
        onlineUsers = _self.onlineUsers;
        if(onlineUsers.hasOwnProperty(userid)) {
            if (app.login.info && app.notifyon) {
                app.utils.toast(onlineUsers[userid].username + "离线了");
            }
            delete onlineUsers[userid];
            app.color.updateUserNameColor(userid, 'gray');
        }
        var onlineNum = Object.getOwnPropertyNames(onlineUsers).length;
        console.log(" "+userid, "logout");
        if (onlineNum) {
            console.log("now ", " "+onlineNum, " online");
        } else {
            console.log(" there is no person now");
        }
    };
    OnlineUserMgr.prototype.updateOnlineUsers = function(list) {
        _self.addList(list);
        var onlineNum = Object.getOwnPropertyNames(_self.onlineUsers).length;
        if (onlineNum) {
            console.log("now ", " "+onlineNum, " online");
        } else {
            console.log(" there is no person now");
        }
    };
    return new OnlineUserMgr();
})();

