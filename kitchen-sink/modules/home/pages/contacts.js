var React = require('react');
var UI = require('UI');
var _ = require('underscore');

var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;

var ContactItemInner = function(userid, username, online) {
    return [
        <List.ItemMedia key="0"><Icon name={"default_head user_head_"+userid} round/></List.ItemMedia>,
        <List.ItemInner key="1">
            <List.ItemTitle style={app.color.usernameColor(online)}>{username}</List.ItemTitle>
        </List.ItemInner>
    ];
};

var ContactItem = React.createClass({
    showContactInfo: function(userid) {
        var param = {userid: userid};
        app.showView("contactInfo", "up", param);
    },
    render: function() {
       var userid = this.props.userid;
       var user = this.props.users[userid];
       var username = user.username||userid;
       var select = this.props.select;
       if (!select) {
           return (
               <List.ItemContent onTap={this.showContactInfo.bind(this, userid)}>
                    {ContactItemInner(userid, username, user.online)}
               </List.ItemContent>
            )
       } else if (select.type == "radio") {
           return (
               <List.ItemContent radio value={userid} name={select.name} checked={select.default===userid} onChange={select.onChange}>
                    {ContactItemInner(userid, username, user.online)}
               </List.ItemContent>
            )
       } else {
           return (
               <List.ItemContent checkbox value={userid} name={select.name} checked={select.default.indexOf(userid)!==-1} onChange={select.onChange}>
                    {ContactItemInner(userid, username, user.online)}
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
        return (
            <List.ListGroup>
                <List.ListGroupTitle data={{'data-index-letter':this.props.letter}}>{this.props.letter}</List.ListGroupTitle>
                {userids.map((userid)=>{return <ContactItem key={userid} userid={userid} users={users} select={select}/>})}
            </List.ListGroup>
        )
    }
});


var ContactList = React.createClass({
    render: function() {
        var users = this.props.users;
        var groupedUsers = this.props.groupedUsers;
        var letters = _.keys(groupedUsers).sort(function(a, b) {return a.localeCompare(b)});
        var select = this.props.select;
        return (
            <List.List block group class="contacts-block">
                {_.map(letters, (letter)=>{return <ContactGroup key={"letter_"+letter} letter={letter} userids={groupedUsers[letter]} users={users} select={select}/>})}
            </List.List>
        );
    }
});

module.exports = React.createClass({
    getInitialState: function() {
        return {
            groupedUsers: app.userMgr.groupedUsers,
            users: app.userMgr.users
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
    render: function() {
        return (
            <ContactList users={this.state.users} groupedUsers={this.state.groupedUsers} select={this.props.select}/>
        );
    }
});
