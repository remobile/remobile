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

function getMessageList(messages) {
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
        props.tail = (!next || (userid!==next.userid));
        props.sent = !!msg.send;
        props.avatar = userid;
        props.nameStyle = users[userid].online?{color:"#00FF7F"}:{color:"gray"};
        props.name = msg.send?false:(pre&&pre.userid===userid&&!timeStr?false:msg.username);

        list.push(<MessageText {...props}>{msg.msg}</MessageText>);
    }
    return list;
}


var MessageList = React.createClass({
    render: function() {
        var list = getMessageList(this.props.messages);
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
        this.param = this.props.data.param;
    },
    componentDidMount: function() {
        app.userMgr.addChangeListener(this._onChange);
        app.messageMgr.addDisplayMessageChangeListener(this._onChange);
        app.messageMgr.getUserMessage(this.param.userid);
    },
    componentWillUnmount: function() {
        app.userMgr.removeChangeListener(this._onChange);
        app.messageMgr.removeDisplayMessageChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState({
            messages: app.messageMgr.displayMessage
        });
    },
    handleSend: function() {
        var text = this.refs.toolbar.getValue();
        var mgr = app.messageMgr;
        if (this.param.type === mgr.USER_TYPE) {
            mgr.sendUserMessage(this.param.userid, text, mgr.TEXT_TYPE);
        } else {
            mgr.sendGroupMessage(this.param.username, text, mgr.TEXT_TYPE, this.sendGroupUserId);
        }
    },
    render: function() {
        return (
            <View.Page title="Messages" toolbar>
                <View.PageContent message>
                    <MessageList messages={this.state.messages}/>
                </View.PageContent>
                <Message.MessageToolbar onSend={this.handleSend} ref="toolbar"/>
            </View.Page>
        );
    }
});
