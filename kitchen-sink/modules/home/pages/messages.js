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
            type: type,
            target: target
        };
        app.showView('messageInfo', 'fade', param);
    },
    render: function() {
        var msg = this.props.msg;
        var userid = msg.userid;
        var user = app.userMgr.users[userid];
        var username = user.username||userid;
        var time = app.date.getShowDate(msg.time);
        var group = (msg.type===app.messageMgr.GROUP_TYPE);
        var groupname = msg.username;
        var message = msg.msg;
        var style =user.online?{color:"#00FF7F"}:{color:"gray"};
        if (group) {
            return (
                <List.ItemContent>
                    <List.ItemMedia><Icon name={"icon-default-head user_head_"+groupname} round/></List.ItemMedia>
                    <List.ItemInner onTap={this.showMessageInfo.bind(this, msg.type, groupname)}>
                        <List.ItemTitleRow>
                            <List.ItemTitle>
                                <span style={{color:"red"}}>{groupname}</span>
                            </List.ItemTitle>
                            <List.ItemAfter>{time}</List.ItemAfter>
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
            return (
                <List.ItemContent>
                    <List.ItemMedia><Icon name={"icon-default-head user_head_"+userid} round/></List.ItemMedia>
                    <List.ItemInner onTap={this.showMessageInfo.bind(this, msg.type, userid)}>
                        <List.ItemTitleRow>
                            <List.ItemTitle style={style}>{username}</List.ItemTitle>
                            <List.ItemAfter>{time}</List.ItemAfter>
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
                {messages.map((msg)=>{return <MessageItem msg={msg}/>})}
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
