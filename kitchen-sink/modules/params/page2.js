var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Button = UI.Button.Button;

var navbar = React.createClass({
    render() {
        return (
            <View.Navbar backText="Back" title="page2">
                <View.NavbarButton right iconOnly icon="icon-bars"></View.NavbarButton>
            </View.Navbar>
        )
    }
});

var toolbar = React.createClass({
    render() {
        return (
            <div className="toolbar-inner">
                <a href="#" className="link">Dummy Link</a>
                <a href="#" data-popover=".popover-menu" className="open-popover link">Menu</a>
            </div>
        )
    }
});

var page = React.createClass({
    gotoNextPage() {
        app.showView('page3', {text:'Are you page 3'}, {text:'I am page 2'});
    },
    goBack() {
        app.goBack(1, {text:'I am back 2'});
    },
	render() {
		return (
			<View.PageContent>
                <Content.ContentBlockTitle>Page 2</Content.ContentBlockTitle>
              <Content.ContentBlock>
                  <p>come from: {this.props.params.from}</p>
                  <p>params: {this.props.params.text}</p>
                  <p>saved: {this.props.saved.text}</p>
              </Content.ContentBlock>

              <Content.ContentBlock>
                  <Button  onTap={this.gotoNextPage}>go to page 3</Button>
              </Content.ContentBlock>
              <Content.ContentBlock>
                  <Button  onTap={this.goBack}>back to page 1</Button>
              </Content.ContentBlock>
          </View.PageContent>
		);
	}
});

module.exports = {navbar, toolbar, page};
