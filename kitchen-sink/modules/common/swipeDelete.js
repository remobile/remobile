var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Swipe Delete" />
        )
    }
});

module.exports.page = React.createClass({
	deleteItem(e) {
		var clicked = $(e.target);
		this.refs.list.swipeout.delete(clicked.parents('.swipeout'));
	},
	render() {
		return (
			<View.PageContent>
	            <Content.ContentBlock>
	            	<p>Swipe out actions on list elements is one of the most awesome F7 features. It allows you to call hidden menu for each list element where you can put default ready-to use delete button or any other buttons for some required actions. </p>
	            </Content.ContentBlock>
	            <Content.ContentBlockTitle>Swipe to delete with confirm modal</Content.ContentBlockTitle>
	            <List.List block swipeout ref="list">
	                <List.ItemContent swipeout
	                    swipeoutRight=<a className="swipeout-delete" onClick={this.deleteItem}>Delete</a>
	                    >
	                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
	                    <List.ItemInner>
	                        <List.ItemTitle>Ivan Petrov</List.ItemTitle>
	                        <List.ItemAfter>CEO</List.ItemAfter>
	                    </List.ItemInner>
	                 </List.ItemContent>
	                <List.ItemContent swipeout
	                    swipeoutLeft=<a className="bg-green swipeout-overswipe">Reply</a>
	                    swipeoutRight=<a className="swipeout-delete" onClick={this.deleteItem}>Delete</a>
	                    >
	                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
	                    <List.ItemInner>
	                        <List.ItemTitle>John Doe</List.ItemTitle>
	                        <List.ItemAfter><Badge>5</Badge></List.ItemAfter>
	                    </List.ItemInner>
	                 </List.ItemContent>
	                 {/*swipeout-overswipe will be pull to overswipe*/}
	                <List.ItemContent swipeout
	                    swipeoutLeft={[<a className="bg-green swipeout-overswipe">Reply</a>, <a className="bg-blue">Forword</a>]}
	                    swipeoutRight={[<a>More</a>, <a className="bg-orange">More</a>, <a className="swipeout-delete swipeout-overswipe" onClick={this.deleteItem}>Delete</a>]}
	                    >
	                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
	                    <List.ItemInner>
	                        <List.ItemTitle>Jenna Smith</List.ItemTitle>
	                    </List.ItemInner>
	                 </List.ItemContent>
	            </List.List>
	        </View.PageContent>
		);
	}
});
