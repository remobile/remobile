module.exports = define(function(require) {
    var _self;
    function OnlineUserMgr() {
        _self = this;
        _self.onlineUsers = {};
    }


    OnlineUserMgr.prototype.add = function(obj) {
        var userid = obj.userid,
        onlineUsers = _self.onlineUsers;
        app.userMgr.add(obj);
        if(!onlineUsers.hasOwnProperty(userid)) {
            onlineUsers[userid] = obj;
            var onlineNum = Object.getOwnPropertyNames(onlineUsers).length;
            app.console.log("red@"+userid, "login");
            if (onlineNum) {
                app.console.log("now ", "red@"+onlineNum, " online");
            } else {
                app.console.log("red@there is no person now");
            }
        } else {
            app.console.error(userid+" has multi");
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
                app.console.error(userid+" has multi");
            }
        }
    };
    OnlineUserMgr.prototype.remove = function(obj) {
        var userid = obj.userid,
        onlineUsers = _self.onlineUsers;
        if(onlineUsers.hasOwnProperty(userid)) {
            delete onlineUsers[userid];
        }
        var onlineNum = Object.getOwnPropertyNames(onlineUsers).length;
        app.console.log("red@"+userid, "logout");
        if (onlineNum) {
            app.console.log("now ", "red@"+onlineNum, " online");
        } else {
            app.console.log("red@there is no person now");
        }
    };
    OnlineUserMgr.prototype.showOnlineUserList = function() {
        var onlineUsers = _self.onlineUsers;
        var list = [];
        app.console.log(onlineUsers);
        for (var userid in onlineUsers) {
            var user = onlineUsers[userid];
            list.push("green@"+user.userid+":"+user.username);
        }
        app.console.log.apply(null, list);
    };
    OnlineUserMgr.prototype.updateOnlineUsers = function(obj) {
        var list = obj.list;
        _self.addList(list);
        var onlineNum = Object.getOwnPropertyNames(_self.onlineUsers).length;
        if (onlineNum) {
            app.console.log("now ", "red@"+onlineNum, " online");
        } else {
            app.console.log("red@there is no person now");
        }
    };
    return new OnlineUserMgr();
});

