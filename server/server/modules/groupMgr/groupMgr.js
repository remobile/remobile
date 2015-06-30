module.exports = (function() {
    var _self;
    function GroupMgr() {
        _self = this;
        _self.activeGroups = {};
    }

    GroupMgr.prototype.getGroupList = function(socket, obj) {
        app.db.Group._getList(obj.name, obj.creator, obj.users, socket.userid, function(docs) {
            socket.emit('GROUP_LIST_RS', docs)
        });
    };
    GroupMgr.prototype.getGroupInfo = function(socket, obj) {
        app.db.Group._getInfo(obj.name, function(doc) {
            socket.emit('GROUP_INFO_RS', doc)
        });
    };
    GroupMgr.prototype.createGroup = function(socket, obj) {
        var users = obj.users;
        users.push(socket.userid);
        app.db.Group._create(obj.name, socket.userid, users, obj.type, function(err) {
            if (!err) {
                for (var i=0,len=users.length; i<len; i++) {
                    app.db.User._joinGroup(users[i], obj.name, socket.userid, obj.type, users);
                }
                app.socketMgr.notifyOtherUsers(users, socket.userid, 'GROUP_PULL_IN_NF', {name:obj.name, pulledusers:_.without(users, socket.userid), creator:socket.userid, type:obj.type, users:users});
                socket.emit('GROUP_CREATE_RS', {error:null, name:obj.name, type:obj.type, users:users});
            } else {
                socket.emit('GROUP_CREATE_RS', {error:err, name:obj.name});
            }
        });
    };
    GroupMgr.prototype.modifyGroup = function(socket, obj) {
        var users = obj.users;
        users.push(socket.userid);
        app.db.Group._modify(obj.name, users, obj.type, function(err, doc, oldusers) {
            if (!err) {
                var newadd = _.reject(users, function(userid){
                    return _.contains(oldusers, userid);
                });
                var oldrm = _.reject(oldusers, function(userid){
                    return _.contains(users, userid);
                });
                for (var i=0,len=newadd.length; i<len; i++) {
                    app.db.User._joinGroup(newadd[i], obj.name, socket.userid, obj.type, users);
                }
                for (var i=0,len=oldrm.length; i<len; i++) {
                    app.db.User._leaveGroup(oldrm[i], obj.name);
                }
                app.db.User._updateGroup(_.difference(oldusers, oldrm), obj.name, doc.users, doc.type);
                if (_self.activeGroups[obj.name]) {
                    _self.activeGroups[obj.name] = doc;
                }
                app.socketMgr.notifyOtherUsers(doc.users, socket.userid, 'GROUP_PULL_IN_NF', {name:obj.name, pulledusers:newadd, creator:doc.creator, type:doc.type, users:doc.users});
                if (oldrm.length) {
                    app.socketMgr.notifyOtherUsers(oldusers, socket.userid, 'GROUP_FIRE_OUT_NF', {name:obj.name, firedusers:oldrm, users:doc.users});
                }
                socket.emit('GROUP_MODIFY_RS', {error:null, name:obj.name, type:obj.type, users:users});
            } else {
                socket.emit('GROUP_MODIFY_RS', {error:err, name:obj.name});
            }
        });
    };
    GroupMgr.prototype.removeGroup = function(socket, obj) {
        var Group = app.db.Group;
        Group.findOne({name:obj.name}, function(err, doc) {
            if (!doc) {
                socket.emit('GROUP_DELETE_RS', {error:app.error.GROUP_NOT_EXIST, name:obj.name});
            } else {
                if (doc.creator != socket.userid) {
                    socket.emit('GROUP_DELETE_RS', {error:app.error.GROUP_NOT_CREATOR, name:obj.name});
                } else {
                    var users = doc.users;
                    for (var i=0,len=users.length; i<len; i++) {
                        app.db.User._leaveGroup(users[i], obj.name);
                        var client = app.onlineUserMgr.getClient(users[i]);
                        if (client && users[i]!=socket.userid) {
                            app.io.to(client.socketid).emit('GROUP_DELETE_NF', {name:obj.name});
                        }
                    }
                    Group._remove(obj.name, function() {
                        delete _self.activeGroups[obj.name];
                        socket.emit('GROUP_DELETE_RS', {name:obj.name});
                    });
                }
            }
        });
    };
    GroupMgr.prototype.getGroupUsers = function(group, callback) {
        var activeGroups = _self.activeGroups;
        if(!activeGroups.hasOwnProperty(group)) {
            app.db.Group._getInfo(group, function(doc) {
                _self.activeGroups[group] = doc;
                callback(doc.users);
            });
        } else {
            callback(_self.activeGroups[group].users);
        }
    };
    GroupMgr.prototype.joinGroup = function(socket, obj) {
        app.db.Group._join(obj.name, socket.userid, function(err, doc, oldusers) {
            if (!err) {
                app.db.User._joinGroup(socket.userid, obj.name, doc.creator, doc.type, doc.users);
                app.db.User._updateGroup(oldusers, obj.name, doc.users, doc.type);
                if (_self.activeGroups[obj.name]) {
                    _self.activeGroups[obj.name] = doc;
                }
                app.socketMgr.notifyOtherUsers(doc.users, socket.userid, 'GROUP_JOIN_NF', {name:obj.name, userid:socket.userid});
                socket.emit('GROUP_JOIN_RS', {error:null, name:obj.name, creator:doc.creator, type:doc.type, users:doc.users});
            } else {
                socket.emit('GROUP_JOIN_RS', {error:err, name:obj.name});
            }
        });
    };
    GroupMgr.prototype.leaveGroup = function(socket, obj) {
        app.db.Group._leave(obj.name, socket.userid, function(doc) {
            app.db.User._leaveGroup(socket.userid, obj.name);
            app.db.User._updateGroup(doc.users, obj.name, doc.users, doc.type);
            if (_self.activeGroups[obj.name]) {
                _self.activeGroups[obj.name] = doc;
            }
            app.socketMgr.notifyOtherUsers(doc.users, socket.userid, 'GROUP_LEAVE_NF', {name:obj.name, userid:socket.userid});
            socket.emit('GROUP_LEAVE_RS', {name:obj.name});
        });
    };
    GroupMgr.prototype.pullInGroup = function(socket, obj) {
        var users = obj.users;
        app.db.Group._pullIn(obj.name, socket.userid, users, function(err, doc, oldusers) {
            if (!err) {
                for (var i=0,len=users.length; i<len; i++) {
                    app.db.User._joinGroup(users[i], obj.name, doc.creator, doc.type, doc.users);
                }
                app.db.User._updateGroup(oldusers, obj.name, doc.users, doc.type);
                if (_self.activeGroups[obj.name]) {
                    _self.activeGroups[obj.name] = doc;
                }
                app.socketMgr.notifyOtherUsers(doc.users, socket.userid, 'GROUP_PULL_IN_NF', {name:obj.name, pulledusers:users, creator:doc.creator, type:doc.type, users:doc.users});
                socket.emit('GROUP_PULL_IN_RS', {error:null, name:obj.name, users:doc.users});
            } else {
                socket.emit('GROUP_PULL_IN_RS', {error:err, name:obj.name});
            }
        });
    };
    GroupMgr.prototype.fireOutGroup = function(socket, obj) {
        var users = obj.users.split(',');
        app.db.Group._fireOut(obj.name, socket.userid, users, function(err, doc, oldusers) {
            if (!err) {
                for (var i=0,len=users.length; i<len; i++) {
                    app.db.User._leaveGroup(users[i], obj.name);
                }
                app.db.User._updateGroup(doc.users, obj.name, doc.users, doc.type);
                if (_self.activeGroups[obj.name]) {
                    _self.activeGroups[obj.name] = doc;
                }
                app.socketMgr.notifyOtherUsers(oldusers, socket.userid, 'GROUP_FIRE_OUT_NF', {name:obj.name, firedusers:users, users:doc.users});
                socket.emit('GROUP_FIRE_OUT_RS', {error:null, name:obj.name, users:doc.users});
            } else {
                socket.emit('GROUP_FIRE_OUT_RS', {error:err, name:obj.name});
            }
        });
    };

    return new GroupMgr();
})();

