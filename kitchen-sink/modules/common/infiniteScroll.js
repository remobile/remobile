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
    render: function() {
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

module.exports = React.createClass({
    getInitialState: function() {
        return {
            list:(function(n){var arr=[];for(var i=1;i<=n;i++){arr.push(i)}return arr})(20)
        };
    },
    onInfinite: function(e) {
        var self = this;
        setTimeout(function () {
            var len = self.state.list.length;
            self.state.list.push(len+1);
            self.setState({list: self.state.list});
        }, 1000);
    },
	render: function() {
        return (
            <View.Page title="Infinite Scroll">
                <View.PageContent class="infinite-scroll" data={{distance:10}}>
                    <UI.Refresh.InfiniteScroll onInfinite={this.onInfinite}/>
                    <List.List block>
                        {this.state.list.map((item)=>{ return <ListItem value={item}/>})}
                    </List.List>
                </View.PageContent>
            </View.Page>
        );
    }
});
