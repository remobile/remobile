var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Button = UI.Button.Button;

var navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="page3" backText="自定义">
                <View.NavbarButton right iconOnly icon="icon-bars"></View.NavbarButton>
            </View.Navbar>
        )
    }
});

var toolbar = React.createClass({
    render() {
        return (
            <View.Toolbar>
                <Button link>Dummy Link</Button>
                <Button link>Menu</Button>
            </View.Toolbar>
        )
    }
});

var page = React.createClass({
    gotoNextPage() {
        app.showView('page4', {text:'Are you page 4'}, {text:'I am page 3'});
    },
    goBack() {
        app.goBack(1, {text:'I am back 3'});
    },
	render() {
		return (
			<View.PageContent>
                <Content.ContentBlockTitle>Page 3</Content.ContentBlockTitle>
              <Content.ContentBlock>
                  <p>come from: {this.props.params.from}</p>
                  <p>params: {this.props.params.text}</p>
                  <p>saved: {this.props.saved.text}</p>
              </Content.ContentBlock>

              <Content.ContentBlock>
                  <Button onTap={this.gotoNextPage}>go to page 4</Button>
              </Content.ContentBlock>
              <Content.ContentBlock>
                  <Button onTap={this.goBack}>back to page 2</Button>
              </Content.ContentBlock>
          </View.PageContent>
		);
	}
});

module.exports = {navbar, toolbar, page};
