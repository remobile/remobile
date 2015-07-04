module.exports = (function() {
    "use strict";
    var _self;

    function ChatRouter() {
        _self = this;
    }

    ChatRouter.prototype.ON_CONNECT = function(obj) {
        app.chatconnect = true;
    };
    ChatRouter.prototype.ON_RECONNECT = function(obj) {
        app.chatconnect = true;
        app.userMgr.login();
        app.toast('服务器重新连接连接成功');
    };
    ChatRouter.prototype.ON_DISCONNECT = function(obj) {
        app.chatconnect = false;
        app.userMgr.me.online = false;
        app.onlineUserMgr.reset();
        app.groupMgr.reset();
        app.groupMgr.reset();
        app.toast('服务器断开了连接');
    };
    ChatRouter.prototype.ON_USER_LOGIN_RS = function(obj) {
        app.userMgr.onLogin(obj);
    };
    ChatRouter.prototype.ON_USER_LOGIN_NF = function(obj) {
        app.onlineUserMgr.add(obj);
    };
    ChatRouter.prototype.ON_USER_LOGOUT_NF = function(obj) {
        app.onlineUserMgr.remove(obj);
    };
    ChatRouter.prototype.ON_USERS_LIST_NF = function(obj) {
        console.log(obj);
        app.userMgr.addList(obj);
    };
    ChatRouter.prototype.ON_USERS_NOTIFY_NF = function(obj) {
        app.notifyMgr.onNotify(obj);
    };
    ChatRouter.prototype.ON_USER_SEND_MESSAGE_RS = function(obj) {
        app.messageMgr.onSendUserMessage(obj);
    };
    ChatRouter.prototype.ON_USER_MESSAGE_NF = function(obj) {
        app.emit('USER_MESSAGE_NFS', {from:obj.from,msgid:obj.msgid});
        app.messageMgr.showUserMessage(obj);
    };
    ChatRouter.prototype.ON_USER_MESSAGE_RECEIVED_NF = function(obj) {
        app.messageMgr.onUserMessageReceived(obj);
    };
    ChatRouter.prototype.ON_USER_OFFONLINE_MESSAGE_NF = function(obj) {
        app.emit('USER_OFFONLINE_MESSAGE_NFS');
        app.messageMgr.showOfflineMessage(obj);
    };
    ChatRouter.prototype.ON_USER_GET_MESSAGE_RS = function(obj) {
        app.messageMgr.onGetMessage(obj);
    };
    ChatRouter.prototype.ON_USERS_UPDATE_HEAD_RS = function(obj) {
        app.personalInfo.onUpdateHead();
    };
    ChatRouter.prototype.ON_USERS_UPDATE_HEAD_NF = function(obj) {
        app.notifyMgr.updateUserHead(obj);
    };
    ChatRouter.prototype.ON_USERS_GET_HEAD_RS = function(obj) {
        app.notifyMgr.onGetUserHead(obj);
    };
    ChatRouter.prototype.ON_USERS_UPDATE_USERINFO_RS = function(obj) {
        app.personalInfo.onUpdateUserInfo(obj);
    };
    ChatRouter.prototype.ON_USERS_UPDATE_USERINFO_NF = function(obj) {
        app.userMgr.onUpdateUserInfoNotify(obj);
    };
    ChatRouter.prototype.ON_GROUP_LIST_RS = function(obj) {
        app.groupMgr.onGetGroupList(obj);
    };
    ChatRouter.prototype.ON_GROUP_INFO_RS = function(obj) {
        app.groupMgr.onGetGroupInfo(obj);
    };
    ChatRouter.prototype.ON_GROUP_CREATE_RS = function(obj) {
        app.groupMgr.onCreateGroup(obj);
    };
    ChatRouter.prototype.ON_GROUP_MODIFY_RS = function(obj) {
        app.groupMgr.onModifyGroup(obj);
    };
    ChatRouter.prototype.ON_GROUP_DELETE_RS = function(obj) {
        app.groupMgr.onRemoveGroup(obj);
    };
    ChatRouter.prototype.ON_GROUP_DELETE_NF = function(obj) {
        app.groupMgr.onRemoveGroupNotify(obj);
    };
    ChatRouter.prototype.ON_GROUP_JOIN_RS = function(obj) {
        app.groupMgr.onJoinGroup(obj);
    };
    ChatRouter.prototype.ON_GROUP_JOIN_NF = function(obj) {
        app.groupMgr.onJoinGroupNotify(obj);
    };
    ChatRouter.prototype.ON_GROUP_LEAVE_RS = function(obj) {
        app.groupMgr.onLeaveGroup(obj);
    };
    ChatRouter.prototype.ON_GROUP_LEAVE_NF = function(obj) {
        app.groupMgr.onLeaveGroupNotify(obj);
    };
    ChatRouter.prototype.ON_GROUP_PULL_IN_RS = function(obj) {
        app.groupMgr.onPullInGroup(obj);
    };
    ChatRouter.prototype.ON_GROUP_PULL_IN_NF = function(obj) {
        app.groupMgr.onPullInGroupNotify(obj);
    };
    ChatRouter.prototype.ON_GROUP_FIRE_OUT_RS = function(obj) {
        app.groupMgr.onFireOutGroup(obj);
    };
    ChatRouter.prototype.ON_GROUP_FIRE_OUT_NF = function(obj) {
        app.groupMgr.onFireOutGroupNotify(obj);
    };
    ChatRouter.prototype.ON_TICKET_ISSUE_NF = function(obj) {
        app.notifyMgr.onTicketIssueNotify(obj);
    };
    ChatRouter.prototype.ON_TICKET_REPLY_NF = function(obj) {
        app.notifyMgr.onTicketReplyNotify(obj);
    };
    ChatRouter.prototype.ON_WORK_NOTICE_NF = function(obj) {
        app.notifyMgr.onWorkNoticeNotify(obj);
    };
    ChatRouter.prototype.ON_CALL_WEBRTC_SIGNAL_NF = function(obj) {
        app.callMgr.onCallWebrtcSignalNotify(obj);
    };
    ChatRouter.prototype.ON_CALL_OUT_RS = function(obj) {
        app.callMgr.onCallOut(obj);
    };
    ChatRouter.prototype.ON_CALL_IN_NF = function(obj) {
        app.callMgr.onCallInNotify(obj);
    };
    ChatRouter.prototype.ON_CALL_IN_REPLY_NF = function(obj) {
        app.callMgr.onCallInReplyNotify(obj);
    };
    ChatRouter.prototype.ON_CALL_HANGUP_RS = function(obj) {
        app.callMgr.onCallHangup(obj);
    };
    ChatRouter.prototype.ON_CALL_HANGUP_NF = function(obj) {
        app.callMgr.onCallHangupNotify(obj);
    };

    return new ChatRouter();
})();
