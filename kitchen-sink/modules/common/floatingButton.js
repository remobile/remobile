var React = require('react');
var UI = require('UI');
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;


var ListItem = React.createClass({
    showPage(page) {
        app.showView(page);
    },
    render() {
        return (
            <List.ItemContent link onTap={this.showPage.bind(this, this.props.page)}>
                <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                <List.ItemInner>
                    <List.ItemTitle>{this.props.children}</List.ItemTitle>
                </List.ItemInner>
             </List.ItemContent>
        );
    }
});

var MenuList = React.createClass({
    render() {
        return (
            <List.List block>
                <ListItem page="staticFloatingButton">Static Floating Button</ListItem>
                <ListItem page="dialFloatingButton">Dial Floating Button</ListItem>
                <ListItem page="popoverFloatingButton">Popover Floating Button</ListItem>
            </List.List>
        );
    }
});

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Floating Button" />
        )
    }
});

module.exports.page = React.createClass({
	render() {
		return (
			<View.PageContent>
                <Content.ContentBlockTitle>Tabs</Content.ContentBlockTitle>
                <MenuList />
            </View.PageContent>
		);
	}
});
