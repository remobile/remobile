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

var FormItem = React.createClass({
     render: function() {
        return (
             <List.ItemContent>
                    {this.props.icon&&<List.ItemMedia><Icon name={this.props.icon}/></List.ItemMedia>}
                <List.ItemInner>
                    {this.props.label&&<List.ItemTitle label>{this.props.label}</List.ItemTitle>}
                    <List.ItemInput>
                        {this.props.children}
                    </List.ItemInput>
                </List.ItemInner>
            </List.ItemContent>
        );
    }
});

var FormInputItem = React.createClass({
     render: function() {
        return (
             <FormItem icon={this.props.icon} label={this.props.label}>
                 <input type={this.props.input_type} placeholder={this.props.placeholder} value={this.props.value} onChange={this.props.onChange}/>
            </FormItem>
        );
    }
});

var ContactItem = React.createClass({
    render: function() {
        var userid = this.props.userid;
        var user = app.userMgr.users[userid];
        var username = user.username;
        return (
            <List.ItemContent swipeout swipeoutRight=<a className="swipeout-delete" onClick={this.props.onDelete.bind(null, userid)}>Delete</a>>
                <List.ItemMedia><Icon name={"default_head user_head_"+userid} round/></List.ItemMedia>
                <List.ItemInner>
                    <List.ItemTitle style={app.color.usernameColor(user.online)}>{username}</List.ItemTitle>
                </List.ItemInner>
            </List.ItemContent>
        )
    }
});

module.exports = React.createClass({
    getInitialState: function() {
        var param = this.props.data.param;
        var saved = param.saved||{};
        return {
            private: saved.private||false,
            groupname: saved.groupname||'',
            users: param.users||[]
        };
    },
    handleInputChange: function(type, e) {
        var state = {};
        state[type] = e.target.value;
        this.setState(state);
    },
    handleSwitchChange: function(type, checked) {
        var state = {};
        state[type] =  checked;
        this.setState(state);
    },
    onDelete: function(userid, e) {
        var clicked = $(e.target);
        var self = this;
        this.refs.list.swipeout.delete(clicked.parents('.swipeout'), function() {
            self.setState({users: _.without(self.state.users, userid)});
        });
    },
    addReceivers: function() {
        var param = {
            value: this.state.users,
            saved: {
                private: this.state.private,
                groupname: this.state.groupname
            }
        };
        app.showView('selectUsers', 'left', param)
    },
    doCreateGroup: function() {
        console.log(this.state);
    },
    render: function() {
        return (
            <View.Page title="创建群组">
            <View.PageContent>
                <List.List>
                    <FormInputItem icon="icon-form-name" label="群组名称:" input_type="text" placeholder="例如:讨论组" value={this.state.groupname} onChange={this.handleInputChange.bind(this, "groupname")}/>
                    <List.ItemContent>
                        <List.ItemMedia><Icon name={"icon-form-toggle"}/></List.ItemMedia>
                        <List.ItemInner>
                            <List.ItemTitle label style={{width:'80%'}}>私有群组:</List.ItemTitle>
                            <List.ItemInput>
                                <Switch checked={this.state.private} onChange={this.handleSwitchChange.bind(this, "private")}/>
                            </List.ItemInput>
                        </List.ItemInner>
                    </List.ItemContent>
                    <List.ItemContent onTap={this.addReceivers}>
                        <List.ItemMedia><Icon name="ion-ios7-people" /></List.ItemMedia>
                        <List.ItemInner>
                            <List.ItemTitle>群组成员</List.ItemTitle>
                            <List.ItemAfter><Icon color="green" name="ion-plus-circled" /></List.ItemAfter>
                        </List.ItemInner>
                    </List.ItemContent>
                    <List.List inset swipeout ref="list">
                        {this.state.users.map((userid)=>{return <ContactItem key={userid} userid={userid} onDelete={this.onDelete}/>})}
                    </List.List>
                </List.List>
                <Content.ContentBlock>
                    <Grid.Row>
                        <Grid.Col><Button big fill color="green" onTap={this.doCreateGroup}>创建</Button></Grid.Col>
                    </Grid.Row>
                </Content.ContentBlock>
                {false&&<Content.ContentBlock>
                    <Grid.Row>
                        <Grid.Col><Button big fill color="green" onTap={this.doModifyGroup}>确认修改</Button></Grid.Col>
                    </Grid.Row>
                </Content.ContentBlock>}
            </View.PageContent>
            </View.Page>
        );
    }
});
