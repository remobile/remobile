module.exports = (function() {
    "use strict";
    var _self;
    function NotifyMgr() {
        _self = this;
        _self.ticktInfo = {ticket:0};
    }

    NotifyMgr.prototype.onNotify = function(obj) {
        app.emit('USERS_NOTIFY_NFS');
        console.log(obj);
        var have_head_users = [];
        app.login.user_head_db.find(function(err, docs) {
            _.each(docs, function(doc) {
                have_head_users.push(doc.userid);
            });
            var have_notify_users = [];
            var head = obj.head;
            for (var i= 0,len=head.length; i<len; i++) {
                var item = head[i];
                _self.updateUserHead(item);
                have_notify_users.push(item.userid);
            }

            var users = app.userMgr.users;
            var all_users = _.keys(users);
            var need_update_users = _.difference(all_users, have_notify_users, have_head_users);
            app.emit('USERS_GET_HEAD_RQ', need_update_users);
        });
        app.uiMessage.increaseNewTicketNotify(obj.new_ticket);
        app.uiMessage.increaseReplyTicketNotify(obj.reply_ticket);
        if ((obj.new_ticket&&obj.new_ticket.length) || (obj.reply_ticket&&obj.reply_ticket.length)) {
            app.utils.noticeNewMessage();
        }
        app.workNotify.addWorkNotify(obj.work_notice);
    };
    NotifyMgr.prototype.updateUserHead = function(obj) {
        var userid = obj.userid;
        var head = obj.head;
        app.login.user_head_db.upsert({userid: userid}, {head: head});
        $.upsertStyleSheet(app.userHeadCss, '.user_head_'+userid, 'background-image:url('+head+')');
    };
    NotifyMgr.prototype.onGetUserHead = function(obj) {
        for (var i= 0,len=obj.length; i<len; i++) {
            var item = obj[i];
            _self.updateUserHead(item);
        }
    };
    NotifyMgr.prototype.onTicketIssueNotify = function(obj) {
        console.log('onTicketIssueNotify', obj);
        app.utils.playSound(app.resource.aud_message_tip);
        app.uiMessage.increaseNewTicketNotify(obj);
        app.updateChatPageBadge(true);
        var ticket = obj.ticket;
        app.utils.addTicketNotification(ticket.subject, ticket.message);
    };
    NotifyMgr.prototype.onTicketReplyNotify = function(obj) {
        console.log('onTicketReplyNotify', obj);
        app.utils.playSound(app.resource.aud_message_tip);
        app.uiMessage.increaseReplyTicketNotify(obj);
        app.updateChatPageBadge(true);
        var ticket = obj.ticket;
        app.utils.addTicketNotification(ticket.subject, ticket.message, true);
    };
    NotifyMgr.prototype.onWorkNoticeNotify = function(obj) {
        console.log('onWorkNoticeNotify', obj);
        app.utils.playSound(app.resource.aud_message_tip);
        app.workNotify.addWorkNotify(obj);
    };

    return new NotifyMgr();
})();


