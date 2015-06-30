module.exports = (function() {
    var _self;
    function OnlineUserMgr() {
        _self = this;
        _self.onlineUsers = {};
    }

    OnlineUserMgr.prototype.add = function(socket, obj) {
        console.log(obj);
        var userid = obj.userid,
        onlineUsers = _self.onlineUsers;
        if(onlineUsers.hasOwnProperty(userid)) {
            socket.emit('USER_LOGIN_RS', { error:app.error.LOGIN_MORE_TIMES});
            return;
        }
        socket.emit('USER_LOGIN_RS', {list:_.map(_self.getOnlineUserList(userid), function(doc){return _.omit(doc, 'socketid')}), info:obj});
        var client = {
            socketid: socket.id,
            userid: userid,
            username: obj.username
        };
        onlineUsers[userid] = client;
        socket.userid = userid;
        socket.broadcast.emit('USER_LOGIN_NF', {userid:userid, username:obj.username});
        app.userMgr.sendUserList(socket);
        app.notifyMgr.sendUserNotify(socket);
        app.messageMgr.sendOfflineMessage(socket);
        app.db.Logger._logEvent('login', userid);
        console.log(userid+' login');
        console.log('there are(is) '+Object.getOwnPropertyNames(onlineUsers).length+' online');
    };
    OnlineUserMgr.prototype.remove = function(socket) {
        var userid = socket.userid,
        onlineUsers = _self.onlineUsers;
        if(onlineUsers.hasOwnProperty(userid)) {
            delete onlineUsers[userid];
            socket.broadcast.emit('USER_LOGOUT_NF', {userid:userid});
            app.db.Logger._logEvent('logout', userid);
            console.log(userid+' logout');
            console.log('there are(is) '+Object.getOwnPropertyNames(onlineUsers).length+' online');
        }
    };
    OnlineUserMgr.prototype.getOnlineUserList = function(selfid) {
        var onlineUsers = _self.onlineUsers;
        var list = [];
        for (var userid in onlineUsers) {
            list.push(onlineUsers[userid]);
        }
        return list;
    };
    OnlineUserMgr.prototype.getClient = function(userid) {
        var client = _self.onlineUsers[userid];
        return client;
    };

    return new OnlineUserMgr();
})();

