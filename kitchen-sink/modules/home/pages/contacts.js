var React = require('react');
var UI = require('UI');
var _ = require('underscore');

var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;

function showGroupList(){
    app.showView("groupList", "left");
}
function sendMultiMessage(){
    app.showView("sendMultiMessage", "left");
}
var MenuList =[
    <List.ItemContent key={1} link onTap={showGroupList}>
        <List.ItemMedia><Icon name={"img_create_group"}/></List.ItemMedia>
        <List.ItemInner>
            <List.ItemTitle style={{color:"blue"}}>群聊</List.ItemTitle>
        </List.ItemInner>
    </List.ItemContent>,
    <List.ItemContent key={2} link onTap={sendMultiMessage}>
        <List.ItemMedia><Icon name={"img_send_multi"}/></List.ItemMedia>
        <List.ItemInner>
            <List.ItemTitle style={{color:"blue"}}>群发</List.ItemTitle>
        </List.ItemInner>
    </List.ItemContent>
];

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
       var username = user.username;
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
        var letter = this.props.letter;
        return (
            <List.ListGroup>
                <List.ListGroupTitle data={{'data-index-letter':letter}}>{letter}</List.ListGroupTitle>
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
                {!select&&MenuList}
                {_.map(letters, (letter)=>{return <ContactGroup key={letter} letter={letter} userids={groupedUsers[letter]} users={users} select={select}/>})}
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
