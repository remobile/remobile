var React = require('react');
var UI = require('UI');

var Content = UI.Content;
var Grid = UI.Grid;
var List = UI.List;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;
var View = UI.View;
var pages = require('./pages');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            page: app.data.homePageIndex||0
        }
    },
    getDefaultProps: function() {
        return {pages:[pages.Main, pages.Contacts, pages.Messages, pages.More]}
    },
    switchPage: function(page) {
        app.data.homePageIndex = page;
        this.setState({page: page})
    },
    render: function() {
        var CurrentPage = this.props.pages[this.state.page];
		return (
            <View.Page toolbar>
			    <View.PageContent>
                    <CurrentPage />
			    </View.PageContent>
                <View.Toolbar tabbar labels>
                    <View.ToolbarButton active={this.state.page===0}
                        icon={["icon-camera", "icon-back"]}
                        onTap={this.switchPage.bind(this, 0)}>
                            Home
                    </View.ToolbarButton>
                    <View.ToolbarButton active={this.state.page===1}
                        icon={["icon-camera", "icon-back"]}
                        onTap={this.switchPage.bind(this, 1)}>
                            Contacts
                    </View.ToolbarButton>
                    <View.ToolbarButton active={this.state.page===2}
                        icon={["icon-camera", "icon-back"]}
                        onTap={this.switchPage.bind(this, 2)}>
                            Messages
                    </View.ToolbarButton>
                    <View.ToolbarButton active={this.state.page===3}
                        icon={["icon-camera", "icon-back"]}
                        onTap={this.switchPage.bind(this, 3)}>
                            More
                    </View.ToolbarButton>
                 </View.Toolbar>
            </View.Page>
		);
	}
});
