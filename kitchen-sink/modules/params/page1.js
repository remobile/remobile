var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Button = UI.Button.Button;

var navbar = React.createClass({
    render() {
        return (
            <View.Navbar goBack={false} title="page1" >
                <View.NavbarButton right>确定</View.NavbarButton>
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
        app.showView('page2', {text:'Are you page 2'}, {text:'I am page 1'});
    },
	render() {
		return (
			<View.PageContent>
                <Content.ContentBlockTitle>Page 1</Content.ContentBlockTitle>
              <Content.ContentBlock>
                  <p>come from: {this.props.params.from}</p>
                  <p>params: {this.props.params.text}</p>
                  <p>saved: {this.props.saved.text}</p>
              </Content.ContentBlock>

              <Content.ContentBlock>
                  <Button onTap={this.gotoNextPage}>go to page 2</Button>
              </Content.ContentBlock>
          </View.PageContent>
		);
	}
});

module.exports = {navbar, toolbar, page};
