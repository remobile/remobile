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
    getInitialState: function() {
        return {letters:_.keys(app.userMgr.groupedUsers).sort(function(a, b) {return a.localeCompare(b)})};
    },
    componentDidMount: function() {
        app.userMgr.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        app.userMgr.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState({letters:_.keys(app.userMgr.groupedUsers).sort(function(a, b) {return a.localeCompare(b)})});
    },
    render: function() {
        return (
            <List.IndexedList letters={this.state.letters}/>
        );
    }
});

module.exports = React.createClass({
    mixins: [UI.Mixins.RestoreScrollPosition],
    getInitialState: function() {
        return {
            page: app.data.homePageIndex||0,
            messageBadge: app.messageMgr.unreadMessage.total
        }
    },
    getDefaultProps: function() {
        return {pages:[pages.Contacts, pages.Messages, pages.More]}
    },
    switchPage: function(page) {
        app.data.homePageIndex = page;
        this.setState({page: page})
    },
    componentDidMount: function() {
        app.messageMgr.addNewestMessageChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        app.messageMgr.removeNewestMessageChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState({messageBadge: app.messageMgr.unreadMessage.total});
    },
    render: function() {
        var CurrentPage = this.props.pages[this.state.page];
		return (
            <View.Page labelsTabbar>
            	<View.Toolbar tabbar labels class="toolbar-bottom">
	                <View.ToolbarButton active={this.state.page===0}
	                    icon="ion-android-contacts"
	                    onTap={this.switchPage.bind(this, 0)}>
	                        Contacts
	                </View.ToolbarButton>
	                <View.ToolbarButton active={this.state.page===1}
	                    icon="ion-chatbubble-working"
                        badge={(this.state.messageBadge>0)&&<Badge color="red">{this.state.messageBadge}</Badge>}
	                    onTap={this.switchPage.bind(this, 1)}>
	                        Messages
	                </View.ToolbarButton>
	                <View.ToolbarButton active={this.state.page===2}
	                    icon="ion-settings"
	                    onTap={this.switchPage.bind(this, 2)}>
	                        More
	                </View.ToolbarButton>
	             </View.Toolbar>
			    <View.PageContent>
                    <CurrentPage data={this.props.data}/>
			    </View.PageContent>
			  	{this.state.page===0&&<IndexedList />}
            </View.Page>
		);
	}
});
