var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Button = UI.Button.Button;

var navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="page1" >
                <View.NavbarButton right>确定</View.NavbarButton>
            </View.Navbar>
        )
    }
});

var toolbar = React.createClass({
    render() {
        return (
            <View.Toolbar>
                <Button link>Dummy Link1</Button>
                <Button link>Menu1</Button>
            </View.Toolbar>
        )
    }
});

var page = React.createClass({
    gotoNextPage() {
        app.showView('page2', {text:'Are you page 2'});
    },
    goBack() {
        app.goBack(1, {text:'I am back 2'});
    },
	render() {
		return (
			<View.PageContent>
                <Content.ContentBlockTitle>Page 1</Content.ContentBlockTitle>
                <Content.ContentBlock>
                    <p>params: {this.props.params.text}</p>
                </Content.ContentBlock>

                <Content.ContentBlock>
                    <Button onTap={this.gotoNextPage}>go to page 2</Button>
                </Content.ContentBlock>
                <Content.ContentBlock>
                  <Button  onTap={this.goBack}>back to home</Button>
              </Content.ContentBlock>
          </View.PageContent>
		);
	}
});

module.exports = {navbar, toolbar, page};
