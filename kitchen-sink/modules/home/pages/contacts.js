var React = require('react');
var UI = require('UI');
var _ = require('underscore');

var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;

var MenuItem = React.createClass({
    getDefaultProps: function() {
        return {color:"blue"}
    },
    render: function() {
        return (
            <List.ItemContent onTap={this.props.onTap}>
                <List.ItemMedia><Icon name={this.props.icon}/></List.ItemMedia>
                <List.ItemInner>
                    <List.ItemTitle style={{color:this.props.color, fontWeight:"bold"}}>{this.props.label}</List.ItemTitle>
                </List.ItemInner>
            </List.ItemContent>
        )
   }
});

var MenuList = React.createClass({
    showGroupList: function(){
        var onlineType = this.props.onlineType;
        app.showView("groupList", "left", {saved:{onlineType:onlineType}});
    },
    sendMultiMessage: function(){
        var onlineType = this.props.onlineType;
        app.showView("sendMultiMessage", "left", {saved:{onlineType:onlineType}});
    },
    render: function() {
        var onlineType = this.props.onlineType;
        var select = this.props.select;
        if (select) {
            return (
                <List.ListGroup>
                    <MenuItem color={onlineType?"blue":"green"} icon={onlineType?"img_user_online":"img_user_offline"} label={onlineType?"只显示在线联系人":"显示所有联系人"} onTap={this.props.changeShowOnline} />
                </List.ListGroup>
            )
        } else {
            return (
                <List.ListGroup>
                    <MenuItem icon="img_group_chat" label="群聊" onTap={this.showGroupList} />
                    <MenuItem icon="img_send_multi" label="发送给多人" onTap={this.sendMultiMessage} />
                    <MenuItem color={onlineType?"green":"blue"} icon={onlineType?"img_user_online":"img_user_offline"} label={onlineType?"显示所有联系人":"只显示在线联系人"} onTap={this.props.changeShowOnline} />
                </List.ListGroup>
            )
        }
   }
});

var ContactItemInner = function(userid, username, user) {
    return [
        <List.ItemMedia key="0"><Icon name={"default_head user_head_"+userid} round/></List.ItemMedia>,
        <List.ItemInner key="1">
            <List.ItemTitle style={app.color.usernameColor(user)}>{username}</List.ItemTitle>
        </List.ItemInner>
    ];
};

var ContactItem = React.createClass({
    showContactInfo: function(userid) {
        var param = {userid: userid, saved:{onlineType: this.props.onlineType}};
        app.showView("contactInfo", "up", param);
    },
    render: function() {
       var userid = this.props.userid;
       var user = this.props.users[userid];
       var username = user.username;
       var select = this.props.select;
       if (!select) {
           return (
               <List.ItemContent onTap={this.showContactInfo.bind(this, userid)}>
                    {ContactItemInner(userid, username, user)}
               </List.ItemContent>
            )
       } else if (select.type == "radio") {
           return (
               <List.ItemContent radio value={userid} name={select.name} checked={select.default===userid} onChange={select.onChange}>
                    {ContactItemInner(userid, username, user)}
               </List.ItemContent>
            )
       } else {
           return (
               <List.ItemContent checkbox value={userid} name={select.name} checked={select.default.indexOf(userid)!==-1} onChange={select.onChange}>
                    {ContactItemInner(userid, username, user)}
               </List.ItemContent>
            )
       }
   }
});

var ContactGroup = React.createClass({
    render: function() {
        var users = this.props.users;
        var userids = this.props.userids;
        var select = this.props.select;
        var letter = this.props.letter;
        var onlineType = this.props.onlineType;
        return (
            <List.ListGroup>
                <List.ListGroupTitle data={{'data-index-letter':letter}}>{letter}</List.ListGroupTitle>
                {userids.map((userid)=>{return <ContactItem key={userid} onlineType={onlineType} userid={userid} users={users} select={select}/>})}
            </List.ListGroup>
        )
    }
});

var ContactList = React.createClass({
    render: function() {
        var onlineType = this.props.onlineType;
        var users = this.props.users;
        var groupedUsers = this.props.groupedUsers;
        if (onlineType) {
            var newGroupedUsers = {};
            _.mapObject(groupedUsers, (userids, letter) => {
                var newUserids = _.filter(userids, (userid) => {
                    return users[userid].online;
                });
                if (newUserids.length) {
                    newGroupedUsers[letter] = newUserids;
                }
            });
            groupedUsers = newGroupedUsers;
        }
        var letters = _.keys(groupedUsers).sort(function(a, b) {return a.localeCompare(b)});
        var select = this.props.select;
        return (
            <List.List block group class="contacts-block">
                <MenuList select={select} onlineType={onlineType} changeShowOnline={this.props.changeShowOnline}/>
                {_.map(letters, (letter)=>{return <ContactGroup key={letter} onlineType={onlineType} letter={letter} userids={groupedUsers[letter]} users={users} select={select}/>})}
            </List.List>
        );
    }
});

module.exports = React.createClass({
    getInitialState: function() {
        var saved = this.props.data.param.saved||{};
        return {
            groupedUsers: app.userMgr.groupedUsers,
            users: app.userMgr.users,
            onlineType: saved.onlineType
        };
    },
    componentDidMount: function() {
        app.userMgr.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        app.userMgr.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState({
            groupedUsers: app.userMgr.groupedUsers,
            users: app.userMgr.users
        });
    },
    changeShowOnline: function() {
        this.setState({onlineType: !this.state.onlineType});
    },
    render: function() {
        return (
            <ContactList users={this.state.users} groupedUsers={this.state.groupedUsers} select={this.props.select} onlineType={this.state.onlineType} changeShowOnline={this.changeShowOnline}/>
        );
    }
});
