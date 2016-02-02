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
        return {letters:['A', 'B', 'C', 'D', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].sort((a, b)=>{return a.localeCompare(b)})};
    },
    render() {
        return (
            <List.IndexedList letters={this.state.letters}/>
        );
    }
});

var TITLES = ['主页', '联系人', '消息', '设置'];


var navbar = React.createClass({
    render() {
        return (
            <View.Navbar goBack={false} title="主页" >
                <View.NavbarButton right>确定</View.NavbarButton>
            </View.Navbar>
        )
    }
});

var toolbar = React.createClass({
    render() {
        return (
            <View.Toolbar tabbar labels>
                <View.LabelTabBarButton
                    active
                    href='tabbar-with-home'
                    icon="ion-social-windows-outline">
                    Home
                </View.LabelTabBarButton>

                <View.LabelTabBarButton
                    href='tabbar-with-contacts'
                    icon="ion-android-contacts">
                    Contacts
                </View.LabelTabBarButton>

                <View.LabelTabBarButton
                    href='tabbar-with-messages'
                    icon="ion-chatbubble-working"
                    badge={
                        <Badge color="red">9</Badge>
                    }>
                    Messages
                </View.LabelTabBarButton>

                <View.LabelTabBarButton
                    href='tabbar-with-more'
                    icon="ion-settings">
                    More
                </View.LabelTabBarButton>
            </View.Toolbar>
        )
    }
});

var page = React.createClass({
	render() {
        return (
            <View.PageContent>
                <div className="tabs">
                    <div id="tabbar-with-home" className="tab active">
                        <pages.Home />
                    </div>
                    <div id="tabbar-with-contacts" className="tab">
                        <pages.Contacts />
                    </div>
                    <div id="tabbar-with-messages" className="tab">
                        <pages.Messages />
                    </div>
                    <div id="tabbar-with-more" className="tab">
                        <pages.More />
                    </div>
                </div>
            </View.PageContent>
        );
	}
});

module.exports = {navbar, toolbar, page};
