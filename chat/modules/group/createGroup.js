var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var List = UI.List;
var Grid = UI.Grid;
var Card = UI.Card;
var Modal = UI.Modal;
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
                    <List.ItemTitle style={app.color.usernameColor(user)}>{username}</List.ItemTitle>
                </List.ItemInner>
            </List.ItemContent>
        )
    }
});

var ButtonItem = React.createClass({
    render: function() {
        return (
            <Content.ContentBlock>
                <Grid.Row>
                    <Grid.Col><Button big fill color={this.props.color} onTap={this.props.onTap}>{this.props.label}</Button></Grid.Col>
                </Grid.Row>
            </Content.ContentBlock>
        );
    }
})

module.exports = React.createClass({
    getInitialState: function() {
        var param = this.props.data.param;
        var saved = param.saved||{};
        var from = this.props.data.from;
        if(from === "groupDetail"){
            var group = app.groupMgr.list[param.groupid];
            this.groupid = param.groupid;
            return {
                type: group.type,
                groupname: group.name,
                members: group.members
            }
        } else {
            this.groupid = saved.groupid;
            console.log(param);
            return {
                type: saved.type||false,
                groupname: saved.groupname||'',
                members: param.users||[]
            }
        }
    },
    componentDidMount: function() {
        app.groupMgr.addEventListener(this._onListener);
    },
    componentWillUnmount: function() {
        app.groupMgr.removeEventListener(this._onListener);
    },
    _onListener: function(obj) {
        var type = obj.type;
        switch(type) {
            case "ON_CREATE_GROUP":
                obj.error?app.showChatError(obj.error):app.toast("创建群组成功");
                app.hideWait();
                app.goBack();
            break;
            case "ON_MODIFY_GROUP":
                obj.error?app.showChatError(obj.error):app.toast("修改群组成功");
                app.hideWait();
                app.goBack();
            break;
            case "ON_REMOVE_GROUP":
                obj.error?app.showChatError(obj.error):app.toast("解散群组成功");
                app.hideWait();
                app.goBack(2);
            break;
            case "ON_UPDATE_GROUP":
                if (this.props.data.from === "groupDetail" && this.groupid === obj.id) {
                    var group = app.groupMgr.list[obj.id];
                    this.setState({
                        type: group.type,
                        groupname: group.name,
                        members: group.members
                    });
                }
            break;
            default:;
        }
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
            self.setState({members: _.without(self.state.members, userid)});
        });
    },
    addMembers: function() {
        var param = {
            value: this.state.members,
            saved: {
                type: this.state.type,
                groupname: this.state.groupname,
                groupid: this.groupid
            }
        };
        app.showView('selectUsers', 'left', param)
    },
    doCreateGroup: function() {
        var name = this.state.groupname;
        var members = this.state.members;
        var type = this.state.type;
        app.showWait();
        app.groupMgr.createGroup(name, members, type);
    },
    doModifyGroup: function() {
        var name = this.state.groupname;
        var members = this.state.members;
        var type = this.state.type;
        app.showWait();
        app.groupMgr.modifyGroup(this.groupid, name, members, type);
    },
    doDeleteGroup: function() {
        var self = this;
        var confirm = <Modal.Confirm title="警告" text="你确定要解散该群吗?"
                okFunc={function() {
                    app.showWait();
                    app.groupMgr.removeGroup(self.groupid);
                }}
            />;
        app.showModal('modal', confirm);
    },
    render: function() {
        var title;
        var buttons = [];
        if (this.groupid==null) {
            title = "创建群组";
            buttons.push(<ButtonItem key="createGroup" color="green" label="创建" onTap={this.doCreateGroup}/>);
        } else {
            title = "修改群组";
            buttons.push(<ButtonItem key="modifyGroup" color="green" label="确认修改" onTap={this.doModifyGroup}/>);
            buttons.push(<ButtonItem key="deleteGroup" color="red" label="解散群组" onTap={this.doDeleteGroup}/>);
        }
        return (
            <View.Page title={title}>
            <View.PageContent>
                <List.List>
                    <FormInputItem icon="icon-form-name" label="群组名称:" input_type="text" placeholder="例如:讨论组" value={this.state.groupname} onChange={this.handleInputChange.bind(this, "groupname")}/>
                    <List.ItemContent>
                        <List.ItemMedia><Icon name={"icon-form-toggle"}/></List.ItemMedia>
                        <List.ItemInner>
                            <List.ItemTitle label style={{width:'80%'}}>私有群组:</List.ItemTitle>
                            <List.ItemInput>
                                <Switch checked={this.state.type} onChange={this.handleSwitchChange.bind(this, "type")}/>
                            </List.ItemInput>
                        </List.ItemInner>
                    </List.ItemContent>
                    <List.ItemContent onTap={this.addMembers}>
                        <List.ItemMedia><Icon name="ion-ios7-people" /></List.ItemMedia>
                        <List.ItemInner>
                            <List.ItemTitle>群组成员</List.ItemTitle>
                            <List.ItemAfter><Icon color="green" name="ion-plus-circled" /></List.ItemAfter>
                        </List.ItemInner>
                    </List.ItemContent>
                    <List.List inset swipeout ref="list">
                        {this.state.members.map((userid)=>{return <ContactItem key={userid} userid={userid} onDelete={this.onDelete}/>})}
                    </List.List>
                </List.List>
                {buttons}
            </View.PageContent>
            </View.Page>
        );
    }
});
