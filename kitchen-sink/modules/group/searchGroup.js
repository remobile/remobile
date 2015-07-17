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

var ContactItem = React.createClass({
    render: function() {
       var userid = this.props.userid;
       return (
           <List.ItemContent>
             <List.ItemMedia><Icon name={"default_head user_head_"+userid} round/></List.ItemMedia>
               <List.ItemInner>
                    <List.ItemTitle>fangyunjiang</List.ItemTitle>
               </List.ItemInner>
           </List.ItemContent>
        )
   }
});

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

module.exports = React.createClass({
    getInitialState: function() {
        var param = this.props.data.param;
        var saved = param.saved||{};
        if (this.props.data.from === "searchGroupList") {
            console.log(saved);
            return {
                groupname: saved.groupname||'',
                creators: saved.creators,
                members: saved.members
            }
        }
        var obj = {
            groupname: saved.groupname||'',
            creators: [],
            members: []
        };
        if (saved.creators) {
            obj.creators = saved.creators;
            obj.members = param.users||[];
        } else if(saved.members) {
            obj.members = saved.members;
            obj.creators = param.users||[];
        }
        return obj;
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
            case "ON_GET_GROUP_LIST":
                var groups = obj.groups;
                app.hideWait();
                if (!groups.length) {
                    app.toast("没有符合条件的群组");
                } else {
                    this.showSearchGroupList(groups);
                }
            break;
            default:;
        }
    },
    showSearchGroupList: function(groups) {
        var list = {};
        var alphaList = {};
        _.each(groups, (group)=> {
            var name = group.name;
            var id = group.id;
            var type = group.type;
            var creator = group.creator;
            var alpha = $.fisrtPinyin(name);
            list[id] = group;
            alphaList[alpha] = alphaList[alpha]||[];
            alphaList[alpha].push(id);
        });
        app.showView("searchGroupList", "fade", {
            alphaList: alphaList,
            list: list,
            saved:{
                creators: this.state.creators,
                members: this.state.members,
                groupname: this.state.groupname
            }
        });
    },
    handleInputChange: function(type, e) {
        var state = {};
        state[type] = e.target.value;
        this.setState(state);
    },
    onDelete: function(ref, userid, e) {
        var clicked = $(e.target);
        var self = this;
        if (ref === 'creators-list') {
            this.refs[ref].swipeout.delete(clicked.parents('.swipeout'), function() {
                self.setState({creators: _.without(self.state.creators, userid)});
            });
        } else {
            this.refs[ref].swipeout.delete(clicked.parents('.swipeout'), function() {
                self.setState({members: _.without(self.state.members, userid)});
            });
        }
    },
    addUsers: function(type) {
        var param;
        if (type === "creators") {
            param = {
                value: this.state.creators,
                saved: {
                    members: this.state.members,
                    groupname: this.state.groupname
                }
            };
        } else {
            param = {
                value: this.state.members,
                saved: {
                    creators: this.state.creators,
                    groupname: this.state.groupname
                }
            };
        }
        app.showView('selectUsers', 'left', param)
    },
    doSearchGroup: function() {
        app.showWait();
        app.groupMgr.getGroupList(this.state.groupname, this.state.creators, this.state.members);
    },
    render: function() {
        return (
            <View.Page title="搜索群组">
            <View.PageContent>
                <List.List>
                    <FormInputItem icon="icon-form-email" label="群组名称:" input_type="text" placeholder="例如:讨论组" value={this.state.groupname} onChange={this.handleInputChange.bind(this, "groupname")}/>

                    <List.ItemContent onTap={this.addUsers.bind(null, "creators")}>
                        <List.ItemMedia><Icon name="ion-android-contact" /></List.ItemMedia>
                        <List.ItemInner>
                            <List.ItemTitle>群主:</List.ItemTitle>
                            <List.ItemAfter><Icon color="green" name="ion-plus-circled" /></List.ItemAfter>
                        </List.ItemInner>
                    </List.ItemContent>
                    {!!this.state.creators.length&&<List.List inset swipeout ref="creators-list">
                        {this.state.creators.map((userid)=>{return <ContactItem key={userid} userid={userid} onDelete={this.onDelete.bind(null, "creators-list")}/>})}
                    </List.List>}

                    <List.ItemContent onTap={this.addUsers.bind(null, "members")}>
                        <List.ItemMedia><Icon name="ion-ios7-people" /></List.ItemMedia>
                        <List.ItemInner>
                            <List.ItemTitle>包含群成员:</List.ItemTitle>
                            <List.ItemAfter><Icon color="green" name="ion-plus-circled" /></List.ItemAfter>
                        </List.ItemInner>
                    </List.ItemContent>
                    {!!this.state.members.length&&<List.List inset swipeout ref="members-list">
                        {this.state.members.map((userid)=>{return <ContactItem key={userid} userid={userid} onDelete={this.onDelete.bind(null, "members-list")}/>})}
                    </List.List>}
                </List.List>

                <Content.ContentBlock>
                    <Grid.Row>
                        <Grid.Col><Button big fill color="green" onTap={this.doSearchGroup}>搜索</Button></Grid.Col>
                    </Grid.Row>
                </Content.ContentBlock>
            </View.PageContent>
            </View.Page>
        );
    }
});
