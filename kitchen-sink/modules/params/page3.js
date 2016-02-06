var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Button = UI.Button.Button;
//var LifeCycle = require('@remobile/react-lifecycle');

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
                <Button link>Dummy Link3</Button>
                <Button link>Menu3</Button>
            </View.Toolbar>
        )
    }
});

var page = React.createClass({
    // mixins: [LifeCycle('page3', 2)],
    gotoNextPage() {
        app.showView('page4', {text:'Are you page 4'});
    },
    goBack() {
        app.goBack(1, {text:'I am back 3'});
    },
	render() {
		return (
			<View.PageContent>
                <Content.ContentBlockTitle>Page 3</Content.ContentBlockTitle>
              <Content.ContentBlock>
                  <p>params: {this.props.params.text}</p>
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
