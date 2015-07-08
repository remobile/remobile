module.exports = (function() {
    "use strict";

    function GroupMgr() {
        this.reset();
    }

    GroupMgr.prototype.reset = function() {
        this.list = {};
        this.init = false;
    };
    GroupMgr.prototype.add = function(obj, noupdate) {
        var name = obj.name,
            list = this.list;
        if(!list.hasOwnProperty(name)) {
            list[name] = obj;
            if (!noupdate && app.groupList) {
                app.groupList.showGroupList();
            }
        } else {
            console.error(userid+" has multi");
        }
    };
    GroupMgr.prototype.remove = function(obj, noupdate) {
        if(this.list.hasOwnProperty(obj.name)) {
            delete this.list[obj.name];
            if (!noupdate && app.groupList) {
                app.groupList.showGroupList();
            }
        }
    };
    GroupMgr.prototype.updateUsers = function(obj) {
        this.list[obj.name].users = obj.users;
        if (obj.type != null) {
            this.list[obj.name].type = obj.type;
        }
    };
    GroupMgr.prototype.addUsers = function(obj) {
        var list = this.list[obj.name].users;
        list.push(obj.userid);
    };
    GroupMgr.prototype.removeUsers = function(obj) {
        var list = this.list[obj.name].users;
        this.list[obj.name].users = _.without(list, obj.userid);
    };
    GroupMgr.prototype.addList = function(list) {
        for (var i in list) {
            this.add(list[i], true);
        }
        if (app.groupList) {
            app.groupList.showGroupList();
        }
        this.init = true;
    };
    GroupMgr.prototype.showGroupMessage = function(obj) {
        console.log('[',  obj.group,  obj.from, ']'+obj.msg);
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
        app.emit('GROUP_LIST_RQ', obj);
    };
    GroupMgr.prototype.onGetGroupList = function(obj) {
        app.searchGroup.updateGroupList(obj);
    };
    GroupMgr.prototype.getGroupInfo = function(group) {
        app.emit('GROUP_INFO_RQ', {name: group});
    };
    GroupMgr.prototype.onGetGroupInfo = function(obj) {
        if (obj) {
            console.log(obj);
        } else {
            console.error("there is no group");
        }
    };
    GroupMgr.prototype.createGroup = function(name, users, type) {
        type = type&&1||0;
        app.emit('GROUP_CREATE_RQ', {name:name, users:users, type:type});
    };
    GroupMgr.prototype.onCreateGroup = function(obj) {
        if (obj.error) {
            console.error("create "+obj.name+" failed: for "+obj.error);
            app.utils.error(app.error[obj.error]);
        } else {
            this.add({name:obj.name, creator:app.login.userid, type:obj.type, users:obj.users});
            console.log("create "+obj.name+" success");
        }
    };
    GroupMgr.prototype.modifyGroup = function(name, users, type) {
        type = type&&1||0;
        app.emit('GROUP_MODIFY_RQ', {name:name, users:users, type:type});
    };
    GroupMgr.prototype.onModifyGroup = function(obj) {
        if (obj.error) {
            console.error("modify "+obj.name+" failed: for "+obj.error);
            app.utils.error(app.error[obj.error]);
        } else {
            this.list[obj.name].users = obj.users;
            this.list[obj.name].type = obj.type;
            if (app.groupDetail) {
                app.groupDetail.showGroupDetail();
            }
            app.utils.toast("修改群组"+obj.name+"成功");
            console.log("modify "+obj.name+" success");
        }
    };
    GroupMgr.prototype.removeGroup = function(name) {
        app.emit('GROUP_DELETE_RQ', {name:name});
    };
    GroupMgr.prototype.onRemoveGroup = function(obj) {
        if (obj.error) {
            console.error("remove "+obj.name+" failed: for "+obj.error);
            app.utils.error(app.error[obj.error]);
        } else {
            this.remove(obj);
            console.log("remove "+obj.name+" success");
        }
    };
    GroupMgr.prototype.onRemoveGroupNotify = function(obj) {
        this.remove(obj);
        console.log( obj.name, 'is been delete');
    };
    GroupMgr.prototype.joinGroup = function(name) {
        app.emit('GROUP_JOIN_RQ', {name:name});
    };
    GroupMgr.prototype.onJoinGroup = function(obj) {
        if (obj.error) {
            console.error("join "+obj.name+" failed: for "+obj.error);
            app.utils.error(app.error[obj.error]);
        } else {
            this.add({name:obj.name, creator:obj.creator, type:obj.type, users:obj.users});
            console.log("join "+obj.name+" success");
        }
    };
    GroupMgr.prototype.onJoinGroupNotify = function(obj) {
        this.addUsers({name:obj.name, userid:obj.userid});
        console.log( obj.userid, 'join group',  obj.name);
    };
    GroupMgr.prototype.leaveGroup = function(name) {
        app.emit('GROUP_LEAVE_RQ', {name:name});
    };
    GroupMgr.prototype.onLeaveGroup = function(obj) {
        this.remove(obj);
        console.log("leave "+obj.name+" success");
    };
    GroupMgr.prototype.onLeaveGroupNotify = function(obj) {
        this.removeUsers({name:obj.name, userid:obj.userid});
        console.log( obj.userid, 'lest group',  obj.name);
    };
    GroupMgr.prototype.pullInGroup = function(name, users) {
        app.emit('GROUP_PULL_IN_RQ', {name:name, users:users});
    };
    GroupMgr.prototype.onPullInGroup = function(obj) {
        if (obj.error) {
            console.error("pull "+obj.name+" failed: for "+obj.error);
            app.utils.error(app.error[obj.error]);
        } else {
            this.updateUsers({name:obj.name, users:obj.users});
            console.log("pull "+obj.name+" success");
        }
    };
    GroupMgr.prototype.onPullInGroupNotify = function(obj) {
        if (_.contains(obj.users, app.login.userid)) {
            this.add({name:obj.name, creator:obj.creator, type:obj.type, users:obj.users});
            console.log('you have been pull',  obj.name);
        } else {
            this.updateUsers({name:obj.name, users:obj.users, type:obj.type});
            if (obj.pulledusers.length) {
                console.log(JSON.stringify(obj.pulledusers), 'been pull', obj.name, obj.users);
            } else {
                console.log(obj.name, 'been modify', 'type='+obj.type);
            }
        }
    };
    GroupMgr.prototype.fireOutGroup = function(name, users) {
        app.emit('GROUP_FIRE_OUT_RQ', {name:name, users:users});
    };
    GroupMgr.prototype.onFireOutGroup = function(obj) {
        if (obj.error) {
            console.error("fireOut "+obj.name+" failed: for "+obj.error);
            app.utils.error(app.error[obj.error]);
        } else {
            this.updateUsers({name:obj.name, users:obj.users});
            console.log("fireOut "+obj.name+" success");
        }
    };
    GroupMgr.prototype.onFireOutGroupNotify = function(obj) {
        if (_.contains(obj.users, app.login.userid)) {
            this.remove(obj);
            console.log('you have been fire',  obj.name);
        } else {
            this.updateUsers({name:obj.name, users:obj.users});
            console.log(JSON.stringify(obj.users), 'been fire', obj.name);
        }
    };

    return new GroupMgr();
})();


