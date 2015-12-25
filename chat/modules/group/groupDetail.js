var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var List = UI.List;
var Grid = UI.Grid;
var Modal = UI.Modal;
var Card = UI.Card;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Switch = UI.Form.Switch;
var Button = UI.Button.Button;

var ContactItem = React.createClass({
    render: function() {
       var userid = this.props.userid;
       var user = app.userMgr.users[userid];
       return (
           <List.ItemContent>
             <List.ItemMedia><Icon name={"default_head user_head_"+userid} round/></List.ItemMedia>
               <List.ItemInner>
                    <List.ItemTitle style={app.color.usernameColor(user)}>{user.username}</List.ItemTitle>
               </List.ItemInner>
           </List.ItemContent>
        )
   }
});

var MemberList = React.createClass({
    render: function() {
        var members = this.props.members;
        return (
            <List.List group>
            	<ul style={{paddingLeft:"10px"}}>
            		{members.map((userid)=>{return <ContactItem key={userid} userid={userid}/>})}
            	</ul>
            </List.List>
        );
    }
});

var FormLabelItem = React.createClass({
     render: function() {
         console.log(this.props.value);
        return (
            <List.ItemContent>
                <List.ItemMedia><Icon name={this.props.icon}/></List.ItemMedia>
                <List.ItemInner>
                    <List.ItemTitle label>{this.props.label}</List.ItemTitle>
                    <List.ItemInput>
                        <input type="text" value={this.props.value} readonly/>
                    </List.ItemInput>
                </List.ItemInner>
            </List.ItemContent>
        );
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
});

module.exports = React.createClass({
    getInitialState: function() {
        var param = this.props.data.param;
        this.search = this.props.data.from==="searchGroupList";
        var group = param.group||app.groupMgr.list[param.saved.groupid];
        return {
            group:group
        };
    },
    componentDidMount: function() {
        app.groupMgr.addEventListener(this._onListener);
        app.userMgr.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        app.groupMgr.removeEventListener(this._onListener);
        app.userMgr.removeChangeListener(this._onChange);
    },
    _onListener: function(obj) {
        var type = obj.type;
        switch(type) {
            case "ON_LEAVE_GROUP":
                obj.error?app.showChatError(obj.error):app.toast("退出群组成功");
                app.hideWait();
                app.goBack();
            break;
            case "ON_JOIN_GROUP":
                obj.error?app.showChatError(obj.error):app.toast("加入群组成功");
                app.hideWait();
                app.goBack(3);
            break;
            case "ON_UPDATE_GROUP":
                if (this.state.group.id === obj.id) {
                    this.setState({group:app.groupMgr.list[obj.id]});
                }
            break;
            case "ON_FIRE_OUT_GROUP":
                if (this.state.group.id === obj.id) {
                    app.toast("你已经被踢出了这个群");
                    app.goBack();
                }
            break;
            default:;
        }
    },
    _onChange: function() {
        this.forceUpdate();
    },
    doGroupChat: function() {
    	var group = this.state.group;
    	app.showView('messageInfo', 'left', {
            type: app.messageMgr.GROUP_TYPE,
            groupid: group.id,
            saved: {groupid: group.id}
        });
    },
    doManageGroup: function() {
        var group = this.state.group;
        app.showView('createGroup', 'left', {
            groupid: group.id,
            saved: {groupid: group.id}
        });
    },
    doLeaveGroup: function() {
        var groupid = this.state.group.id;
        var confirm = <Modal.Confirm title="警告" text="你确定要退出该群吗?"
                okFunc={function() {
                		app.showWait();
                    app.groupMgr.leaveGroup(groupid);
                }}
            />;
        app.showModal('modal', confirm);
    },
    doAddGroup: function() {
        app.showWait();
        app.groupMgr.joinGroup(this.state.group.id);
    },
    render: function() {
        var group = this.state.group;
        var creator = app.userMgr.users[group.creator].username;
        var selfid = app.loginMgr.userid;
        var buttons = [];
        if (this.search) {
                buttons.push(<ButtonItem key="addGroup" color="green" label="加入群组" onTap={this.doAddGroup}/>);
        } else {
                buttons.push(<ButtonItem key="groupChat" color="green" label="发消息" onTap={this.doGroupChat}/>);
                if (group.creator === selfid) {
                    buttons.push(<ButtonItem key="manageGroup" color="green" label="管理群组" onTap={this.doManageGroup}/>);
                } else {
                    buttons.push(<ButtonItem key="leaveGroup" color="red" label="退出群组" onTap={this.doLeaveGroup}/>);
                }
        }

        return (
            <View.Page title="群组详情">
                <View.PageContent>
                    <List.List>
                        <FormLabelItem icon="icon-form-tel" label="群组名称:" value={group.name}/>
                        <FormLabelItem icon="icon-form-name" label="创建者:" value={creator}/>
                        <FormLabelItem icon="icon-form-tel" label="群组类型:" value={group.type?"私有群组":"公有群组"}/>
                        <UI.Accordion.AccordionItem list content={<MemberList members={group.members}/>}>
                            <List.ItemLink>
                                <List.ItemMedia><Icon name={"icon-form-name"}/></List.ItemMedia>
                            <List.ItemInner>
                                <List.ItemTitle label style={{width:'80%'}}>群组成员:</List.ItemTitle>
                                <List.ItemAfter><Badge color="green">{group.members.length}</Badge></List.ItemAfter>
                            </List.ItemInner>
                           </List.ItemLink>
                        </UI.Accordion.AccordionItem>
                    </List.List>
                    {buttons}
                </View.PageContent>
            </View.Page>
        );
    }
});
