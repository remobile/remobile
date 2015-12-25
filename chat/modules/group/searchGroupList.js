var React = require('react');
var UI = require('UI');
var _ = require('underscore');

var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;


var GroupItem = React.createClass({
    render: function() {
       var groupid = this.props.groupid;
       var group = this.props.list[groupid];
       return (
           <List.ItemContent onTap={this.props.showGroupDetail.bind(this, group)}>
              <List.ItemMedia><Icon name={"default_head group_head_"+groupid}/></List.ItemMedia>
			        <List.ItemInner>
			            <List.ItemTitle>{group.name}</List.ItemTitle>
			        </List.ItemInner>
           </List.ItemContent>
        )
   }
});

var GroupGroup = React.createClass({
    render: function() {
        var groupids = this.props.groupids;
        var list = this.props.list;
        var letter = this.props.letter;
        return (
            <List.ListGroup>
                <List.ListGroupTitle data={{'data-index-letter':letter}}>{letter}</List.ListGroupTitle>
                {groupids.map((groupid)=>{return <GroupItem key={groupid} groupid={groupid} list={list} showGroupDetail={this.props.showGroupDetail}/>})}
            </List.ListGroup>
        )
    }
});


var GroupList = React.createClass({
    render: function() {
        var list = this.props.list;
        var alphaList = this.props.alphaList;
        var letters = this.props.letters;
        return (
            <List.List block group class="contacts-block">
                {_.map(letters, (letter)=>{return <GroupGroup key={letter} letter={letter} groupids={alphaList[letter]} list={list} showGroupDetail={this.props.showGroupDetail}/>})}
            </List.List>
        );
    }
});

module.exports = React.createClass({
    getInitialState: function() {
        var param = this.props.data.param;
        var from = this.props.data.from;
        var saved = param.saved;
        if (from === "groupDetail") {
            return {
                list: saved.list,
                alphaList: saved.alphaList
            };
        }
        return {
            list: param.list,
            alphaList: param.alphaList
        };
    },
    showGroupDetail: function(group) {
        var param = {
            group: group,
            saved: {
                list:this.state.list,
                alphaList: this.state.alphaList
            }
        };
        app.showView("groupDetail", "left", param);
    },
    render: function() {
        var alphaList = this.state.alphaList;
        var letters = _.keys(alphaList).sort(function(a, b) {return a.localeCompare(b)});
        return (
            <View.Page title="群组列表">
                <View.PageContent>
                    <GroupList alphaList={alphaList} list={this.state.list} letters={letters} showGroupDetail={this.showGroupDetail}/>
                <List.IndexedList letters={letters}/>
                </View.PageContent>
            </View.Page>
        );
    }
});
