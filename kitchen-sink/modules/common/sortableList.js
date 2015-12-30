var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;

var ListItem = React.createClass({
    render: function() {
        return (
        <List.ItemContent sortable>
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
			open: false
		}
	},
	handleClick: function() {
		app.sortableToggle();
		this.setState({open:!this.state.open});
	},
	render: function() {
		var text = this.state.open?"Done":"Edit";
		return (
			<View.Page title="Sortable List" right={<View.NavbarButton right iconOnly onTap={this.handleClick}>{text}</View.NavbarButton>}>
				<View.PageContent>
            <Content.ContentBlock>
            	<p>Just click "Edit" button on navigation bar to enable sorting</p>
            </Content.ContentBlock>
            <List.List block sortable>
                {[1,2,3,4,5].map((item)=>{ return <ListItem value={item}/>})}
            </List.List>
        </View.PageContent>
       </View.Page>
		);
	}
});
