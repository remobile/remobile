var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Card = UI.Card;
var List = UI.List;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Button = UI.Button.Button;

function showCenterToastWithIcon() {
	app.toast("fangyunjiang", "icon-f7");
}

module.exports = React.createClass({
	render: function() {
        return (
            <View.Page title="Toast">
            <View.PageContent>
            		<p><Button onTap={showCenterToastWithIcon}>Center Toast With Icon</Button></p>
            		<p><Button>Center Toast Only Icon</Button></p>
            		<p><Button>Center Toast Only Text</Button></p>
            		<p><Button>Bottom Toast Only Text</Button></p>
            		<p><Button>Bottom Toast With Icon</Button></p>
            </View.PageContent>
            </View.Page>
        );
    }
});
