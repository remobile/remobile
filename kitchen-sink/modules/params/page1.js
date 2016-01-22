var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Button = UI.Button.Button;

var navbar = React.createClass({
    render() {
        return (
            <div className='navbar-inner'>
                <div className="left"></div>
                <div className="center sliding">page1</div>
                <div className="right"><a href="#" className="open-panel link icon-only"><i className="icon icon-bars"></i></a></div>
            </div>
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
        app.showView('page2', {text:'Are you page 2'}, {text:'I am page 1'});
    },
	render() {
		return (
			<View.PageContent>
                <Content.ContentBlockTitle>Page 1</Content.ContentBlockTitle>
              <Content.ContentBlock>
                  <p>come from: {this.props.from}</p>
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
