var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Button = UI.Button.Button;

var navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="page6">
                <View.NavbarButton right iconOnly icon="icon-bars"></View.NavbarButton>
            </View.Navbar>
        )
    }
});

var toolbar = React.createClass({
    render() {
        return (
            <View.Toolbar>
                <Button link>Dummy Link6</Button>
                <Button link>Menu6</Button>
            </View.Toolbar>
        )
    }
});

var page = React.createClass({
    goBack() {
        app.goBack(1, {text:'I am back 6'});
    },
	render() {
		return (
			<View.PageContent>
                <Content.ContentBlockTitle>Page 6</Content.ContentBlockTitle>
              <Content.ContentBlock>
                  <p>params: {this.props.params.text}</p>
              </Content.ContentBlock>

              <Content.ContentBlock>
                  <Button onTap={this.goBack}>back to page 5</Button>
              </Content.ContentBlock>
          </View.PageContent>
		);
	}
});

module.exports = {navbar, toolbar, page};
