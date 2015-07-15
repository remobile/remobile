var React = require('react');
var assign = require('object-assign');
var UI = require('UI');

var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;

var menu_list = {
	"-1":{name: "新建一个群", icon: "img_create_group", onTap: function(){app.showView("createGroup", "left")}},
	"-2":{name: "加入群组", icon: "img_search_group", onTap: function(){app.showView("searchGroup", "left")}}
};

var GroupItem = React.createClass({
    showGroupInfo: function(ismenu, group) {
    	if (ismenu) {
    		group.onTap();
        } else {
            var param = {group: group};
            app.showView("groupDetail", "left", param);
        }
    },
    render: function() {
       var groupid = this.props.groupid;
       var groupname, icon, group;
       var ismenu = !!menu_list[groupid];

       var icon = "group_head_"+groupid;
       if (ismenu) {
       		group = menu_list[groupid];
       		groupname = group.name;
       		icon = group.icon;
       } else {
       		group = app.groupMgr.list[groupid];
       		groupname = group.name;
       		icon = "group_head_"+groupid;
       }
       return (
           <List.ItemContent onTap={this.showGroupInfo.bind(this, ismenu, group)}>
             <List.ItemMedia><Icon name={"icon-default-head "+icon}/></List.ItemMedia>
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
                {groupids.map((groupid)=>{return <GroupItem groupid={groupid}/>})}
            </List.ListGroup>
        )
    }
});


var GroupList = React.createClass({
    render: function() {
        var alphaList = this.props.alphaList;
        var letters = _.keys(alphaList).sort(function(a, b) {return a.localeCompare(b)});
        return (
            <List.List block group class="contacts-block">
                {_.map(letters, (letter)=>{return <GroupGroup key={letter} letter={letter} groupids={alphaList[letter]}/>})}
            </List.List>
        );
    }
});

module.exports = React.createClass({
    getInitialState: function() {
        var alphaList = app.groupMgr.alphaList;
        alphaList = assign({"*":_.keys(menu_list)}, alphaList);
        return {
            alphaList: alphaList
        };
    },
    componentDidMount: function() {
        app.groupMgr.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        app.groupMgr.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        var alphaList = app.groupMgr.alphaList;
        alphaList = assign({"*":_.keys(menu_list)}, alphaList);
        this.setState({
            alphaList: alphaList
        });
    },
    render: function() {
        return (
            <GroupList alphaList={this.state.alphaList}/>
        );
    }
});
