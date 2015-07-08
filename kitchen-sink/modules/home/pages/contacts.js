var React = require('react');
var UI = require('UI');
var _ = require('underscore');

var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;

var ContactItem = React.createClass({
   render: function() {
       var userid = this.props.userid;
       var user = this.props.users[userid];
       var username = user.username||userid;
       var style =user.online?{color:"#00FF7F"}:{color:"gray"};
       return (
           <List.ItemContent>
             <List.ItemMedia><Icon name={"icon-default-head user_head_"+userid} round/></List.ItemMedia>
               <List.ItemInner>
                    <List.ItemTitle style={style}>{username}</List.ItemTitle>
               </List.ItemInner>
           </List.ItemContent>
        )
   }
});

var ContactGroup = React.createClass({
    render: function() {
    		var users = this.props.users;
    		var userids = this.props.userids;
        return (
            <List.ListGroup>
                <List.ListGroupTitle data={{'data-index-letter':this.props.letter}}>{this.props.letter}</List.ListGroupTitle>
                {userids.map((userid)=>{return <ContactItem userid={userid} users={users}/>})}
            </List.ListGroup>
        )
    }
});


var ContactList = React.createClass({
    render: function() {
        var users = this.props.users;
        var groupedUsers = this.props.groupedUsers;
        var letters = _.keys(groupedUsers).sort(function(a, b) {return a.localeCompare(b)});
        return (
            <List.List block group class="contacts-block">
                {_.map(letters, (letter)=>{return <ContactGroup letter={letter} userids={groupedUsers[letter]} users={users}/>})}
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
            <ContactList users={this.state.users} groupedUsers={this.state.groupedUsers}/>
        );
    }
});
