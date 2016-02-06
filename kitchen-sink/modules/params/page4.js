var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Button = UI.Button.Button;

var navbar = React.createClass({
    render() {
        return (
            <View.Navbar  title="page4">
                <View.NavbarButton right iconOnly icon="icon-bars"></View.NavbarButton>
            </View.Navbar>
        )
    }
});

var toolbar = React.createClass({
    render() {
        return (
            <View.Toolbar>
                <Button link>Dummy Link4</Button>
                <Button link>Menu4</Button>
            </View.Toolbar>
        )
    }
});

var page = React.createClass({
    gotoNextPage() {
        app.showView('page5', {text:'Are you page 5'});
    },
    goBack() {
        app.goBack(1, {text:'I am back 4'});
    },
	render() {
		return (
			<View.PageContent>
                <Content.ContentBlockTitle>Page 4</Content.ContentBlockTitle>
              <Content.ContentBlock>
                  <p>params: {this.props.params.text}</p>
              </Content.ContentBlock>

              <Content.ContentBlock>
                  <Button onTap={this.gotoNextPage}>go to page 5</Button>
              </Content.ContentBlock>
              <Content.ContentBlock>
                  <Button onTap={this.goBack}>back to page 3</Button>
              </Content.ContentBlock>
          </View.PageContent>
		);
	}
});

module.exports = {navbar, toolbar, page};
