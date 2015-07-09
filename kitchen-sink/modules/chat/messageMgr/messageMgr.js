var EventEmitter = require('events').EventEmitter;
var assign = require("object-assign");

module.exports = (function() {
    "use strict";
    function MessageMgr() {
        assign(this, EventEmitter.prototype);

        this.msgid = localStorage.msgid||1;

        //message type
        this.TEXT_TYPE = 0;
        this.IMAGE_TYPE = 1;
        this.AUDIO_TYPE = 2;
        this.VIDEO_TYPE = 3;

        //user type
        this.USER_TYPE = 0;
        this.GROUP_TYPE = 1;

        //message per count
        this.PER_COUNT = 10;

        this.newestMessage = [];
        this.displayMessage = [];
    }

    MessageMgr.prototype.emitNewestMessageChange = function() {
        this.emit("newest_message_change");
    };
    MessageMgr.prototype.addNewestMessageChangeListener = function(callback) {
        this.on("newest_message_change", callback);
    };
    MessageMgr.prototype.removeNewestMessageChangeListener = function(callback) {
        this.removeListener("newest_message_change", callback);
    };
    MessageMgr.prototype.emitDisplayMessageChange = function() {
        this.emit("display_message_change");
    };
    MessageMgr.prototype.addDisplayMessageChangeListener = function(callback) {
        this.on("display_message_change", callback);
    };
    MessageMgr.prototype.removeDisplayMessageChangeListener = function(callback) {
        this.removeListener("display_message_change", callback);
    };
    MessageMgr.prototype.increaseMsgId = function() {
        this.msgid++;
        if (!this.msgid) {
            this.msgid = 1;
        }
        localStorage.msgid = this.msgid;
    };
    MessageMgr.prototype.getNewestMessage = function() {
        var self = this;
        app.db_newest_message.find(function (err, docs) {
            self.newestMessage = _.sortBy(docs, function(obj) {
                return -obj.time;
            });
            self.emitNewestMessageChange();
        });
    };
    MessageMgr.prototype.getUserMessage = function(userid, time) {
        var query = {
            type: this.USER_TYPE,
            userid: userid
        };
        if (time) {
            query.time = {$lt: time};
        }
        var self = this;
        app.db_history_message.find(query, function (err, docs) {
            var message = _.sortBy(docs, function (obj) {
                return -obj.time;
            }).slice(0, self.PER_COUNT);

            if (time) {
                self.displayMessage = message.reverse().concat(self.displayMessage);
            } else {
                self.displayMessage = message.reverse();
            }
            self.emitDisplayMessageChange();
        });
    };
    MessageMgr.prototype.getGroupMessage = function(name, time) {
        var query = {
            type: this.GROUP_TYPE,
            username: name
        };
        if (time) {
            query.time = {$lt: time};
        }
        var self = this;
        app.db_history_message.find(query, function (err, docs) {
            var message = _.sortBy(docs, function (obj) {
                return -obj.time;
            }).slice(0, self.PER_COUNT);

            if (time) {
                self.displayMessage = message.reverse().concat(self.displayMessage);
            } else {
                self.displayMessage = message.reverse();
            }
            self.emitDisplayMessageChange();
        });
    };
    MessageMgr.prototype.increaseUserUnreadNotify = function(userid) {
        var us = app.us;
        var obj = us.object("message_badges")||{};
        if (!obj[userid]) {
            obj[userid] = 1;
        } else {
            obj[userid]++;
        }
        us.object("message_badges", obj);
    };
    MessageMgr.prototype.increaseGroupUnreadNotify = function(name, touserid) {
        var us = app.us;
        var obj = us.object("group_message_badges")||{};
        if (!obj[name]) {
            obj[name] = 1;
        } else {
            obj[name]++;
        }
        us.object("group_message_badges", obj);

        obj = us.object("GROUP_CHAT_AT_NUMBERS")||{};
        if (touserid == app.loginMgr.userid) {
            if (!obj[name]) {
                obj[name] = 1;
            } else {
                obj[name]++;
            }
            us.object("GROUP_CHAT_AT_NUMBERS", obj);
        }
    };
    MessageMgr.prototype.showNewestMessage = function(type, userid, username, time, msg, msgtype, send, touserid) {
        var isGroup = (type===this.GROUP_TYPE);
        if (isGroup) {
            this.increaseUserUnreadNotify(userid);
        } else {
            this.increaseGroupUnreadNotify(username, touserid);
        }
        var newest_message = {userid:userid, username: username, time: time, msg: msg, msgtype:msgtype, touserid:touserid};
        if (isGroup) {
            this.newestMessage = _.reject(this.newestMessage, function(item){return item.username==username&&item.type==type});
            this.newestMessage.unshift(assign({type:type, username:username}, newest_message));
            app.db_newest_message.upsert({type: type, username: username}, newest_message);
            console.log("update newest_message_db", {type: type, username: username}, {username: username,time: time, msg: msg, msgtype:msgtype});
        } else {
            this.newestMessage = _.reject(this.newestMessage, function(item){return item.userid==userid&&item.type==type});
            this.newestMessage.unshift(assign({type:type, userid:userid}, newest_message));
            app.db_newest_message.upsert({type: type, userid: userid}, newest_message);
            console.log("update newest_message_db", {type: type, userid: userid}, {username: username,time: time, msg: msg, msgtype:msgtype});
        }
        this.emitNewestMessageChange();

        var display_message = {type:type, userid:userid, username:username, time:time, msg:msg, msgtype:msgtype};
        if (send != null ) {
            display_message.send = send;
        }
        if (touserid) {
            display_message.touserid = touserid;
        }
        this.displayMessage.push(display_message);
        this.emitDisplayMessageChange();

        app.db_history_message.insert(display_message);
        console.log("update history_message_db", display_message);
    };
    MessageMgr.prototype.sendUserMessage = function(users, msg, msgtype) {
        this.increaseMsgId();
        app.emit('USER_SEND_MESSAGE_RQ', {type:this.USER_TYPE, to:users, msg:msg, msgtype:msgtype, msgid:this.msgid});
        var list = users.split(',');
        var time = Date.now();
        var allUsers = app.userMgr.users;
        for (var i= 0,len=list.length; i<len; i++) {
            var userid = list[i];
            this.showNewestMessage(this.USER_TYPE, userid, allUsers[userid].username, time, msg, msgtype, this.msgid);
        }
    };
    MessageMgr.prototype.sendGroupMessage = function(group, msg, msgtype, touserid) {
        this.increaseMsgId();
        app.emit('USER_SEND_MESSAGE_RQ', {type:this.GROUP_TYPE, to:group, msg:msg, msgtype:msgtype, msgid:this.msgid, touserid:touserid});
        var time = Date.now();
        this.showNewestMessage(this.GROUP_TYPE, app.loginMgr.userid, group, time, msg, msgtype, this.msgid, touserid);
    };
    MessageMgr.prototype.onSendUserMessage = function(obj) {
        if (obj.error) {
            console.error(error);
        } else {
            console.log("send to "+obj.to+" ["+obj.msgid+"]", obj.time, "server success");
        }
    };
    MessageMgr.prototype.addMessageNotification = function(username, message, isGroup) {
        return;
        if (isGroup) {
            username = "【群】:"+username;
        }
        username = "来自 "+username+" 的消息"
        navigator.utils.addNotification(MESSAGE_NOTIFY_ID, username, message);
    };
    MessageMgr.prototype.showUserMessage = function(obj) {
        app.playSound(app.resource.aud_message_tip);
        if (obj.type == this.USER_TYPE) {
            var allUsers = app.userMgr.users;
            var username = allUsers[obj.from].username;
            this.addMessageNotification(username||obj.from, obj.msg);
            this.showNewestMessage(this.USER_TYPE, obj.from, username, obj.time, obj.msg, obj.msgtype);
            console.log('['+obj.from+']','['+obj.msgid+']:', obj.msg, obj.msgtype, obj.time);
        } else {
            this.addMessageNotification(obj.group, obj.msg, true);
            this.showNewestMessage(this.GROUP_TYPE, obj.from, obj.group, obj.time, obj.msg, obj.msgtype, null, obj.touserid);
            console.log(' group:'+obj.group, ' ['+obj.from+']',' ['+obj.msgid+']:', obj.msg, obj.msgtype, obj.time, obj.touserid);
        }
    };
    MessageMgr.prototype.onUserMessageReceived = function(obj) {
        console.log(' ['+obj.msgid+']:',  obj.to, 'received');
    };
    MessageMgr.prototype.noticeNewMessage = function(obj) {
        return;
        app.playSound(app.resource.aud_new_message);
    };
    MessageMgr.prototype.showOfflineMessage = function(obj) {
        if (!app.uiMessage.hasUpdateLogMessage) {
            setTimeout(function() {
                this.showOfflineMessage(obj);
            }, 200);
        } else {
            var len = obj.length;
            var allUsers = app.userMgr.users;
            if (len) {
                this.noticeNewMessage();
            }
            for (var i = 0; i < len; i++) {
                var item = obj[i];
                if (item.type == this.GROUP_TYPE) {
                    console.log(' [' + item.group + ']', ' [' + item.from + '][' + item.time + ']:', item.msg);
                    this.showNewestMessage(this.GROUP_TYPE, item.from, item.group, new Date(item.time).getTime(), item.msg, item.msgtype, null, item.touserid);
                } else {
                    console.log(' [' + item.from + '][' + new Date(item.time).getTime() + ']:', item.msg);
                    this.showNewestMessage(this.USER_TYPE, item.from, allUsers[item.from].username, new Date(item.time).getTime(), item.msg, item.msgtype);
                }
            }
        }
    };
    MessageMgr.prototype.getUserMessageFromServer = function(counter, time) {
        app.emit('USER_GET_MESSAGE_RQ', {type:this.USER_TYPE, counter:counter, time:time, cnt:this.PER_COUNT});
    };
    MessageMgr.prototype.getGroupMessageFromServer = function(counter, time) {
        app.emit('USER_GET_MESSAGE_RQ', {type:this.GROUP_TYPE, counter:counter, time:time, cnt:this.PER_COUNT});
    };
    MessageMgr.prototype.onGetMessage = function(obj) {
        var type = obj.type;
        var msg = obj.msg;
        var _id = obj._id;
        var selfid = app.loginMgr.userid;
        var arr = _.map(msg, function(item) {
            var from = item.from;
            var to = item.to;
            var obj;
            if (from == selfid) {
                return {userid:to, msg:item.msg, msgtype:item.msgtype, time:new Date(item.time).getTime(), send:item.msgid};
            } else {
                return {userid:from, msg:item.msg, msgtype:item.msgtype, time:new Date(item.time).getTime()};
            }
        });
        this.displayMessage = arr.reverse().concat(this.displayMessage);
        this.emitDisplayMessageChange();
    };

    return new MessageMgr();
})();


