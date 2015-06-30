module.exports = define(function(require) {
    var _self;
    function UserMgr() {
        _self = this;
        _self.users = {};
    }

    UserMgr.prototype.add = function(obj) {
        var users = _self.users;
        var userid = obj.userid;
        if(!users.hasOwnProperty(userid)) {
            users[userid] = obj;
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
    };
    UserMgr.prototype.showUserList = function() {
        var onlineUsers = app.onlineUserMgr.onlineUsers;
        var users = _self.users;
        var list = [];
        for (var i in users) {
            var color = "gray";
            for (var j in onlineUsers) {
                if (onlineUsers[j].userid == users[i].userid) {
                    color = "green";
                    break;
                }
            }
            list.push(color+"@"+ users[i].userid+":"+users[i].username);
        }
        app.console.log.apply(null, list);
    };
    UserMgr.prototype.updateHead = function(head) {
        app.socket.emit('USERS_UPDATE_HEAD_RQ', {head:head});
    };

    return new UserMgr();
});


