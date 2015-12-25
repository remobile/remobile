var React = require('react');
var UI = require('UI');

var View = UI.View;
var Message = UI.Message;
var List = UI.List;
var Icon = UI.Icon.Icon;

var ContactItem = React.createClass({
    render: function() {
        var userid = this.props.userid;
        var user = app.userMgr.users[userid];
        var username = user.username;
        return (
            <List.ItemContent swipeout swipeoutRight=<a className="swipeout-delete" onClick={this.props.onDelete.bind(null, userid)}>Delete</a>>
                <List.ItemMedia><Icon name={"default_head user_head_"+userid} round/></List.ItemMedia>
                <List.ItemInner>
                    <List.ItemTitle style={app.color.usernameColor(user)}>{username}</List.ItemTitle>
                </List.ItemInner>
            </List.ItemContent>
        )
    }
});

module.exports = React.createClass({
    getInitialState: function() {
        return {
            users: this.props.data.param.users||[]
        };
    },
    componentWillMount: function() {
        var saved = this.props.data.param.saved;
        if (saved) {
            this.text = saved.text;
        }
    },
    onDelete: function(userid, e) {
        var clicked = $(e.target);
        var self = this;
        this.refs.list.swipeout.delete(clicked.parents('.swipeout'), function() {
            self.setState({users: _.without(self.state.users, userid)});
        });
    },
    addReceivers: function() {
        var text = this.refs.toolbar.getValue();
        app.showView('selectUsers', 'left', {value:this.state.users, saved:{text: text}});
    },
    handleSend: function() {
        var text = this.refs.toolbar.getValue();
        var mgr = app.messageMgr;
        mgr.sendUserMessage(this.state.users.join(','), text, mgr.TEXT_TYPE);
        app.goBack();
    },
    render: function() {
        return (
            <View.Page title="Messages" toolbar>
                <View.PageContent message class="pull-to-refresh-content">
                    <List.List swipeout ref="list">
                        <List.ItemContent onTap={this.addReceivers}>
                            <List.ItemMedia><Icon name="ion-ios7-people" /></List.ItemMedia>
                            <List.ItemInner>
                                <List.ItemTitle>收信人</List.ItemTitle>
                                <List.ItemAfter><Icon color="green" name="ion-plus-circled" /></List.ItemAfter>
                            </List.ItemInner>
                        </List.ItemContent>
                        {this.state.users.map((userid)=>{return <ContactItem key={userid} userid={userid} onDelete={this.onDelete}/>})}
                    </List.List>
                </View.PageContent>
                <Message.MessageToolbar sendChecked={this.state.users.length>0} onSend={this.handleSend} value={this.text} ref="toolbar"/>
            </View.Page>
        );
    }
});
