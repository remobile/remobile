var React = require('react');
var UI = require('UI');
var _ = require('underscore');

var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;

var MessageItem = React.createClass({
    showMessageInfo: function(type, target) {
        var param = {
            type: type
        };
        if (type===app.messageMgr.GROUP_TYPE) {
            param["groupid"] = target;
        } else {
            param["userid"] = target;
        }
        app.showView('messageInfo', 'fade', param);
    },
    render: function() {
        var msg = this.props.msg;
        var userid = msg.userid;
        var user = app.userMgr.users[userid];
        var username = (userid===app.loginMgr.userid)?"我":(user.username);
        var time = app.date.getShowDate(msg.time);
        var isGroup = (msg.type===app.messageMgr.GROUP_TYPE);
        var message = msg.msg;
        var style = app.color.usernameColor(user);
        if (isGroup) {
            var groupid = msg.groupid;
            var badge = app.messageMgr.unreadMessage.group[groupid];
            var group = app.groupMgr.list[groupid];
            if (!group) {
                app.messageMgr.removeLeftGroupMessages(groupid);
                return null;
            }
            var groupname = group.name;
            return (
                <List.ItemContent>
                    <List.ItemMedia><Icon name={"default_head user_head_"+groupid} round/></List.ItemMedia>
                    <List.ItemInner onTap={this.showMessageInfo.bind(this, msg.type, groupid)}>
                        <List.ItemTitleRow>
                            <List.ItemTitle>
                                <span style={{color:"red"}}>{groupname}</span>
                            </List.ItemTitle>
                            <List.ItemAfter>
                                {time}
                                {(badge>0)&&<Badge color="red">{badge}</Badge>}
                            </List.ItemAfter>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>
                            <span style={style}>{username}</span>
                            <span style={{color:"blue"}}>说:</span>
                            {message}
                        </List.ItemSubTitle>
                    </List.ItemInner>
                </List.ItemContent>
            )
        } else {
            var badge = app.messageMgr.unreadMessage.users[userid];
            return (
                <List.ItemContent>
                    <List.ItemMedia><Icon name={"default_head user_head_"+userid} round/></List.ItemMedia>
                    <List.ItemInner onTap={this.showMessageInfo.bind(this, msg.type, userid)}>
                        <List.ItemTitleRow>
                            <List.ItemTitle style={style}>{username}</List.ItemTitle>
                            <List.ItemAfter>
                                {time}
                                {(badge>0)&&<Badge color="red">{badge}</Badge>}
                            </List.ItemAfter>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>{message}</List.ItemSubTitle>
                    </List.ItemInner>
                </List.ItemContent>
            )
        }
    }
});

var NewestMessage = React.createClass({
    render: function() {
        var messages = this.props.messages;
        return (
            <List.List block media>
                {messages.map((msg, i)=>{return <MessageItem key={i} msg={msg}/>})}
            </List.List>
        );
    }
});

module.exports = React.createClass({
    getInitialState: function() {
        return {
            messages: app.messageMgr.newestMessage
        };
    },
    componentDidMount: function() {
        app.userMgr.addChangeListener(this._onChange);
        app.messageMgr.addNewestMessageChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        app.userMgr.removeChangeListener(this._onChange);
        app.messageMgr.removeNewestMessageChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState({
            messages: app.messageMgr.newestMessage
        });
    },
    render: function() {
        return (
            <NewestMessage messages={this.state.messages}/>
        );
    }
});
