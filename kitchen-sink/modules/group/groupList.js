var React = require('react');
var assign = require('object-assign');
var UI = require('UI');

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
    createGroup: function(){
        app.showView("createGroup", "left");
    },
    searchGroup: function(){
        app.showView("searchGroup", "left");
    },
    render: function() {
        return (
            <List.ListGroup>
                <MenuItem icon="img_create_group" label="新建一个群" onTap={this.createGroup} />
                <MenuItem icon="img_send_multi" label="加入群组" onTap={this.searchGroup} />
            </List.ListGroup>
        )
    }
});

var GroupItem = React.createClass({
    showGroupInfo: function(group) {
        var param = {group: group};
        app.showView("groupDetail", "left", param);
    },
    render: function() {
       var groupid = this.props.groupid;
       var icon = "group_head_"+groupid;
       var  group = app.groupMgr.list[groupid];
       var groupname = group.name;
       return (
           <List.ItemContent onTap={this.showGroupInfo.bind(this, group)}>
             <List.ItemMedia><Icon name={"default_head "+icon}/></List.ItemMedia>
               <List.ItemInner>
                    <List.ItemTitle>{groupname}</List.ItemTitle>
               </List.ItemInner>
           </List.ItemContent>
        )
   }
});

var GroupGroup = React.createClass({
    render: function() {
        var groupids = this.props.groupids;
        var letter = this.props.letter;
        return (
            <List.ListGroup>
                <List.ListGroupTitle data={{'data-index-letter':letter}}>{letter}</List.ListGroupTitle>
                {groupids.map((groupid)=>{return <GroupItem key={groupid} groupid={groupid}/>})}
            </List.ListGroup>
        )
    }
});


var GroupList = React.createClass({
    render: function() {
        var alphaList = this.props.alphaList;
        var letters = this.props.letters;
        return (
            <List.List block group class="contacts-block">
                <MenuList />
                {_.map(letters, (letter)=>{return <GroupGroup key={letter} letter={letter} groupids={alphaList[letter]}/>})}
            </List.List>
        );
    }
});

module.exports = React.createClass({
    getInitialState: function() {
        var alphaList = app.groupMgr.alphaList;
        return {
            alphaList: alphaList
        };
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
            case "ON_GROUP_LIST_CHANGE":
                var alphaList = app.groupMgr.alphaList;
                this.setState({
                    alphaList: alphaList
                });
            break;
            case "ON_UPDATE_GROUP":
                this.forceUpdate();
            break;
            default:;
        }
    },
    render: function() {
        var alphaList = this.state.alphaList;
        var letters = _.keys(alphaList).sort(function(a, b) {return a.localeCompare(b)});
        return (
            <View.Page title="群聊">
                <View.PageContent>
                    <GroupList alphaList={alphaList} letters={letters}/>
                </View.PageContent>
                <List.IndexedList letters={letters}/>
            </View.Page>
        );
    }
});
