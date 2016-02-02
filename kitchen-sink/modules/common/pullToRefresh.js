var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Card = UI.Card;
var List = UI.List;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Button = UI.Button.Button;

var ListItem = React.createClass({
    render() {
        return (
        <List.ItemContent>
            <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
            <List.ItemInner>
                <List.ItemTitle>Item {this.props.value}</List.ItemTitle>
                <List.ItemAfter><Badge>{this.props.value}</Badge></List.ItemAfter>
            </List.ItemInner>
         </List.ItemContent>
        );
    }
});

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Pull To Refresh" />
        )
    }
});

module.exports.page = React.createClass({
    getInitialState() {
        return {
            list:[5,4,3,2,1]
        };
    },
    onRefresh(e) {
        var self = this;
        setTimeout(()=>{
            var len = self.state.list.length;
            self.state.list.unshift(len+1);
            self.setState({list: self.state.list});
            e.detail.done();
        }, 1000);
    },
	render() {
        return (
            <View.PageContent class="pull-to-refresh-content">
                <UI.Refresh.PullToRefresh onRefresh={this.onRefresh}/>
                <List.List block>
                    {this.state.list.map((item)=>{ return <ListItem value={item}/>})}
                </List.List>
            </View.PageContent>
        );
    }
});
