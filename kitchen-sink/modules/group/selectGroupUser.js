var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var List = UI.List;
var Grid = UI.Grid;
var Card = UI.Card;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Switch = UI.Form.Switch;
var Button = UI.Button.Button;
var Select = UI.Select;


var ContactItem = React.createClass({
    render: function() {
        var userid = this.props.userid;
        var user = app.userMgr.users[userid];
        var username = user.username;
        return (
            <List.ItemContent radio value={userid} name={select.name} onChange={this.props.onChange}>
                <List.ItemMedia><Icon name={"default_head user_head_"+userid} round/></List.ItemMedia>
                <List.ItemInner>
                    <List.ItemTitle style={app.color.usernameColor(user)}>{username}</List.ItemTitle>
                </List.ItemInner>
            </List.ItemContent>
        )
    }
}

var ContactGroup = React.createClass({
    render: function() {
        var users = this.props.users;
        var userids = this.props.userids;
        var letter = this.props.letter;
        var onChange = this.props.onChange;
        return (
            <List.ListGroup>
                <List.ListGroupTitle data={{'data-index-letter':letter}}>{letter}</List.ListGroupTitle>
                {userids.map((userid)=>{return <ContactItem key={userid} userid={userid} onChange={onChange}/>})}
            </List.ListGroup>
        )
    }
});

var ContactList = React.createClass({
    render: function() {
        var alphaList = this.props.alphaList;
        var letters = _.keys(alphaList).sort(function(a, b) {return a.localeCompare(b)});
        var onChange = this.props.onChange;
        return (
            <List.List block group class="contacts-block">
                {_.map(letters, (letter)=>{return <ContactGroup key={letter} letter={letter} userids={alphaList[letter]} onChange={onChange}>})}
            </List.List>
        );
    }
});

module.exports = React.createClass({
    componentWillMount: function() {
        var groupid = this.props.data.param.target;
        var group = app.groupMgr.list[groupid];
        var users = app.userMgr.users;
        var userids = group.users;
        var selfid = app.loginMgr.userid;
        var alphaList = {};
        _.without(userids, selfid).each((userid)=>{
            var user = users[userid];
            var alpha = $.fisrtPinyin(user.username);
            alphaList[alpha] = alphaList[alpha]||[];
            alphaList[alpha].push(userid);
        });
        this.alphaList = alphaList;
    },
    handleChange: function (userid) {
        console.log(userid);
    },
    render: function() {
        var list = data.map((item)=>{return item.name});
        return (
            <View.Page title="选择发送人">
                <View.PageContent>
                    <ContactList alphaList={this.alphaList} onChange={this.handleChange}/>
                </View.PageContent>
            </View.Page>
        );
    }
});
