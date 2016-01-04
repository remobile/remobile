var React = require('react');
var UI = require('UI');
var _ = require('underscore');

var Content = UI.Content;
var Grid = UI.Grid;
var List = UI.List;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;
var View = UI.View;
var Badge = UI.Badge.Badge;
var pages = require('./pages');


var IndexedList =  React.createClass({
    getInitialState() {
        return {letters:['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'W', 'X', 'Y', 'Z'].sort((a, b)=>{return a.localeCompare(b)})};
    },
    render() {
        return (
            <List.IndexedList letters={this.state.letters}/>
        );
    }
});

module.exports = React.createClass({
    mixins: [UI.Mixins.RestoreScrollPosition],
    getInitialState() {
        return {
            page: app.data.homePageIndex||0,
        }
    },
    getDefaultProps() {
        return {pages:[pages.Home, pages.Contacts, pages.Messages, pages.More]}
    },
    switchPage(page) {
        app.data.homePageIndex = page;
        this.setState({page: page})
    },
    render() {
        var CurrentPage = this.props.pages[this.state.page];
		return (
            <View.Page labelsTabbar>
            	<View.Toolbar tabbar labels class="toolbar-bottom">
	                <View.ToolbarButton active={this.state.page===0}
	                    icon="ion-social-windows-outline"
	                    onTap={this.switchPage.bind(this, 0)}>
	                        Home
	                </View.ToolbarButton>
	                <View.ToolbarButton active={this.state.page===1}
	                    icon="ion-android-contacts"
	                    onTap={this.switchPage.bind(this, 1)}>
	                        Contacts
	                </View.ToolbarButton>
	                <View.ToolbarButton active={this.state.page===2}
	                    icon="ion-chatbubble-working"
                        	badge={<Badge color="red">9</Badge>}
	                    onTap={this.switchPage.bind(this, 2)}>
	                        Messages
	                </View.ToolbarButton>
	                <View.ToolbarButton active={this.state.page===3}
	                    icon="ion-settings"
	                    onTap={this.switchPage.bind(this, 3)}>
	                        More
	                </View.ToolbarButton>
	             </View.Toolbar>
					    <View.PageContent>
		                    <CurrentPage data={this.props.data}/>
					    </View.PageContent>
					  	{this.state.page===1&&<IndexedList />}
            </View.Page>
		);
	}
});
