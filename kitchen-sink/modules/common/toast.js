var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Card = UI.Card;
var List = UI.List;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Button = UI.Button.Button;

function showCenterToastWithIconText() {
	app.toast("fangyunjiang", "icon-f7");
}

function showCenterToastWithOnlyText() {
    app.toast("fangyunjiang");
}

module.exports = React.createClass({
	render: function() {
        return (
            <View.Page title="Toast">
            <View.PageContent>
                <Content.ContentBlock>
                    <p>Toast is a component for show a toast msg, you also can use phonegap's native toast</p>
                </Content.ContentBlock>
                <p><Button onTap={showCenterToastWithIconText}>Center Toast With Icon And Text</Button></p>
                <p><Button onTap={showCenterToastWithOnlyIcon}>Center Toast Only Text</Button></p>
            </View.PageContent>
            </View.Page>
        );
    }
});
