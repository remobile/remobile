module.exports = define(function(require) {
    var _self;

    function GroupMgr() {
        _self = this;
        _self.list = {};
    }

    GroupMgr.prototype.add = function(obj) {
        var name = obj.name,
        list = _self.list;
        if(!list.hasOwnProperty(name)) {
            list[name] = obj;
        } else {
            app.console.error(name +" has multi");
        }
    };
    GroupMgr.prototype.remove = function(obj) {
        if(_self.list.hasOwnProperty(obj.name)) {
            delete _self.list[obj.name];
        }
    };
    GroupMgr.prototype.updateUsers = function(obj) {
         _self.list[obj.name].users = obj.users;
         if (obj.type != null) {
            _self.list[obj.name].type = obj.type;
         }
    };
    GroupMgr.prototype.addUsers = function(obj) {
         var list = _self.list[obj.name].users;
         list.push(obj.userid);
    };
    GroupMgr.prototype.removeUsers = function(obj) {
         var list = _self.list[obj.name].users;
         _self.list[obj.name].users = _.without(list, obj.userid);
    };
    GroupMgr.prototype.addList = function(list) {
        for (var i in list) {
            _self.add(list[i]);
        }
    };
    GroupMgr.prototype.showGroupMessage = function(obj) {
        app.console.log('[', 'blue@'+obj.group, 'red@'+obj.from, ']'+obj.msg);
    };
    GroupMgr.prototype.getGroupList = function(name, creator, users) {
        var obj = {};
        if (name) {
            obj.name = name;
        }
        if (creator) {
            obj.creator = creator;
        }
        if (users) {
            obj.users = users;
        }
        app.socket.emit('GROUP_LIST_RQ', obj);
    };
    GroupMgr.prototype.onGetGroupList = function(obj) {
        var len = obj.length;
        if (!len) {
            app.console.error("there is no group");
        } else {
            for (var i=0,len=obj.length; i<len; i++) {
                app.console.log(obj[i]);
            }
        }
    };
    GroupMgr.prototype.getGroupInfo = function(group) {
        app.socket.emit('GROUP_INFO_RQ', {name: group});
    };
    GroupMgr.prototype.onGetGroupInfo = function(obj) {
        if (obj) {
            app.console.log(obj);
        } else {
            app.console.error("there is no group");
        }
    };
    GroupMgr.prototype.createGroup = function(name, users, type) {
        type = type&&1||0;
        app.socket.emit('GROUP_CREATE_RQ', {name:name, users:users, type:type});
    };
    GroupMgr.prototype.onCreateGroup = function(obj) {
        if (obj.error) {
            app.console.error("create "+obj.name+" failed: for "+app.error[obj.error]);
        } else {
            _self.add({name:obj.name, creator:app.login.userid, type:obj.type, users:obj.users});
            app.console.success("create "+obj.name+" success");
        }
    };
    GroupMgr.prototype.modifyGroup = function(name, users, type) {
        app.socket.emit('GROUP_MODIFY_RQ', {name:name, users:users, type:type});
    };
    GroupMgr.prototype.onModifyGroup = function(obj) {
        if (obj.error) {
            app.console.error("modify "+obj.name+" failed: for "+app.error[obj.error]);
        } else {
            _self.list[obj.name].users = obj.users;
            _self.list[obj.name].type = obj.type;
            app.console.success("modify "+obj.name+" success");
        }
    };
    GroupMgr.prototype.removeGroup = function(name) {
        app.socket.emit('GROUP_DELETE_RQ', {name:name});
    };
    GroupMgr.prototype.onRemoveGroup = function(obj) {
        if (obj.error) {
            app.console.error("remove "+obj.name+" failed: for "+app.error[obj.error]);
        } else {
            _self.remove(obj);
            app.console.success("remove "+obj.name+" success");
        }
    };
    GroupMgr.prototype.onRemoveGroupNotify = function(obj) {
        _self.remove(obj);
        app.console.log('blue@'+obj.name, 'is been delete');
    };
    GroupMgr.prototype.joinGroup = function(name) {
        app.socket.emit('GROUP_JOIN_RQ', {name:name});
    };
    GroupMgr.prototype.onJoinGroup = function(obj) {
        if (obj.error) {
            app.console.error("join "+obj.name+" failed: for "+app.error[obj.error]);
        } else {
            _self.add({name:obj.name, creator:obj.creator, type:obj.type, users:obj.users});
            app.console.success("join "+obj.name+" success");
        }
    };
    GroupMgr.prototype.onJoinGroupNotify = function(obj) {
        _self.addUsers({name:obj.name, userid:obj.userid});
        app.console.log('red@'+obj.userid, 'join group', 'blue@'+obj.name);
    };
    GroupMgr.prototype.leaveGroup = function(name) {
        app.socket.emit('GROUP_LEAVE_RQ', {name:name});
    };
    GroupMgr.prototype.onLeaveGroup = function(obj) {
        _self.remove(obj);
        app.console.success("leave "+obj.name+" success");
    };
    GroupMgr.prototype.onLeaveGroupNotify = function(obj) {
        _self.removeUsers({name:obj.name, userid:obj.userid});
        app.console.log('red@'+obj.userid, 'lest group', 'blue@'+obj.name);
    };
    GroupMgr.prototype.pullInGroup = function(name, users) {
        users = users.split(',');
        app.socket.emit('GROUP_PULL_IN_RQ', {name:name, users:users});
    };
    GroupMgr.prototype.onPullInGroup = function(obj) {
        if (obj.error) {
            app.console.error("pull "+obj.name+" failed: for "+app.error[obj.error]);
        } else {
            _self.updateUsers({name:obj.name, users:obj.users});
            app.console.success("pull "+obj.name+" success");
        }
    };
    GroupMgr.prototype.onPullInGroupNotify = function(obj) {
        if (_.contains(obj.pulledusers, app.login.userid)) {
            _self.add({name:obj.name, creator:obj.creator, type:obj.type, users:obj.users});
            app.console.log('you have been pull', 'blue@'+obj.name);
        } else {
            _self.updateUsers({name:obj.name, users:obj.users, type:obj.type});
            if (obj.pulledusers.length) {
                app.console.log('red@'+JSON.stringify(obj.pulledusers), 'been pull', 'blue@'+obj.name, obj.users);
            } else {
                app.console.log('red@'+obj.name, 'been modify', 'type='+obj.type);
            }
        }
    };
    GroupMgr.prototype.fireOutGroup = function(name, users) {
        app.socket.emit('GROUP_FIRE_OUT_RQ', {name:name, users:users});
    };
    GroupMgr.prototype.onFireOutGroup = function(obj) {
        if (obj.error) {
            app.console.error("fireOut "+obj.name+" failed: for "+app.error[obj.error]);
        } else {
            _self.updateUsers({name:obj.name, users:obj.users});
            app.console.success("fireOut "+obj.name+" success");
        }
    };
    GroupMgr.prototype.onFireOutGroupNotify = function(obj) {
        if (_.contains(obj.firedusers, app.login.userid)) {
            _self.remove(obj);
            app.console.log('you have been fire', 'blue@'+obj.name);
        } else {
            _self.updateUsers({name:obj.name, users:obj.users});
            app.console.log('red@'+JSON.stringify(obj.firedusers), 'been fire', 'blue@'+obj.name, obj.users);
        }
    };

    return new GroupMgr();
});


