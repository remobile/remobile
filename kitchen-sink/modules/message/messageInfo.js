var React = require('react');
var UI = require('UI');

var View = UI.View;
var Message = UI.Message;
var MessageDate= Message.MessageDate;
var MessageText= Message.MessageText;

function getShowTime(time, lastTime) {
    if (!lastTime) {
        return app.date.getShowDateTime(time);
    }

    var date = new Date(time);date.setSeconds(0);date.setMilliseconds(0);
    var last = new Date(lastTime);last.setSeconds(0);last.setMilliseconds(0);

    if (last.getTime() === date.getTime()) {
        return null;
    }
    return app.date.getShowDateTime(time);
};

function getMessageList(messages, isGroup) {
    var lastTime, timeStr;
    var list = [];
    var len = messages.length;
    var users = app.userMgr.users;

    if (!len) {
        return null;
    }
    for (var i=0; i<len; i++) {
        var msg = messages[i];
        timeStr = getShowTime(msg.time, lastTime);
        lastTime = msg.time;
        if (timeStr) {
            var index = list.length-1;
            var item = list[index];
            if (item) {
                list[index] = React.addons.cloneWithProps(item, {tail:true});
            }
            list.push(<MessageDate>{timeStr}</MessageDate>);
        }

        var props = {};
        var userid = msg.userid;
        var next = messages[i+1];
        var pre = messages[i-1];
        var user = users[userid];
        var username = user.username;
        props.tail = (!next || (userid!==next.userid) || !((!!msg.send)===(!!next.send)));
        props.sent = !!msg.send;
        props.avatar = msg.send?app.loginMgr.userid:userid;
        props.nameStyle = app.color.usernameColor(user);
        props.name = msg.send?false:(pre&&pre.userid===userid&&!timeStr?false:username);

        list.push(<MessageText {...props}>{msg.msg}</MessageText>);
    }
    return list;
}


var MessageList = React.createClass({
    render: function() {
        var list = getMessageList(this.props.messages, this.props.isGroup);
        return (
            <Message.Messages>
                {list}
            </Message.Messages>
        );
    }
});

module.exports = React.createClass({
    getInitialState: function() {
        return {
            messages: []
        };
    },
    componentWillMount: function() {
        this.localStorageEnd = false;
        var mgr = app.messageMgr;
        var param = this.props.data.param;
        if (param.type === mgr.USER_TYPE) {
            this.isGroup = false;
            this.userid = param.userid;
            mgr.clearUserUnreadNotify(this.userid);
        } else {
            this.isGroup = true;
            this.groupid = param.groupid;
            mgr.clearGroupUnreadNotify(this.groupid);
        }
    },
    componentDidMount: function() {
        var mgr = app.messageMgr;
        app.userMgr.addChangeListener(this._onChange);
        mgr.addDisplayMessageChangeListener(this._onMessageChange);
        app.groupMgr.addEventListener(this._onListener);
        if (this.isGroup) {
            mgr.displayMessageInfo.target = this.groupid;
            mgr.getGroupMessage(this.groupid);
        } else {
            mgr.displayMessageInfo.target = this.userid;
            mgr.getUserMessage(this.userid);
        }
    },
    componentWillUnmount: function() {
        app.userMgr.removeChangeListener(this._onChange);
        var mgr = app.messageMgr;
        mgr.removeDisplayMessageChangeListener(this._onMessageChange);
        app.groupMgr.removeEventListener(this._onListener);
        mgr.displayMessageInfo = {};
    },
    _onMessageChange: function() {
        if (this.refreshing) {
            var msg =app.messageMgr.displayMessage[0];
            var time = msg&&msg.time;
            if (this.oldestMessageTime === time && !this.localStorageEnd) {
                this.localStorageEnd = true;
                app.messageMgr.getUserMessageFromServer(this.userid, this.oldestMessageTime||Date.now());
            } else {
                var self = this;
                setTimeout(function () {
                    self.refs.refresh.refreshDone();
                    self._onChange(true);
                    self.refreshing = false;
                }, 1000);
            }
        } else {
            this._onChange();
        }
    },
    _onChange: function(noScroll) {
        this.setState({
            messages: app.messageMgr.displayMessage
        }, function() {
            noScroll||$('.page-content').scrollBottom(500);
        });
    },
    _onListener: function(obj) {
        var type = obj.type;
        switch(type) {
            case "ON_FIRE_OUT_GROUP":
                if (this.groupid === obj.id) {
                    app.toast("你已经被踢出了这个群");
                    if (this.props.data.from === "groupDetail") {
                        app.goBack(2);
                    } else {
                        app.goBack();
                    }
                }
            break;
            default:;
        }
    },
    handleSend: function() {
        var text = this.refs.toolbar.getValue();
        var mgr = app.messageMgr;
        if (this.isGroup) {
            mgr.sendGroupMessage(this.groupid, text, mgr.TEXT_TYPE, this.sendGroupUserId);
        } else {
            mgr.sendUserMessage(this.userid, text, mgr.TEXT_TYPE);
        }
        this.refs.toolbar.setValue('');
    },
    handleRefresh: function(e) {
        var msg = this.state.messages[0];
        if (!this.refreshing) {
            this.refreshing = true;
            this.oldestMessageTime = msg&&msg.time;
            if (this.isGroup) {
                if (this.localStorageEnd || !msg) {
                    app.messageMgr.getGroupMessageFromServer(this.groupid, this.oldestMessageTime||Date.now());
                } else {
                    app.messageMgr.getGroupMessage(this.groupid, this.oldestMessageTime);
                }
            } else {
                if (this.localStorageEnd || !msg) {
                    app.messageMgr.getUserMessageFromServer(this.userid, this.oldestMessageTime||Date.now());
                } else {
                    app.messageMgr.getUserMessage(this.userid, this.oldestMessageTime);
                }
            }
        }
    },
    render: function() {
        return (
            <View.Page title="Messages" toolbar>
                <View.PageContent message class="pull-to-refresh-content">
                    <UI.Refresh.PullToRefresh onRefresh={this.handleRefresh} ref="refresh"/>
                    <MessageList messages={this.state.messages} isGroup={this.isGroup}/>
                </View.PageContent>
                <Message.MessageToolbar onSend={this.handleSend} ref="toolbar"/>
            </View.Page>
        );
    }
});
