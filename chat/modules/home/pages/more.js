var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var List = UI.List;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;

var LayoutCell = React.createClass({
		changeColorTheme(color) {
	    var layouts = 'layout-dark layout-white';
	    $('body').removeClass(layouts).addClass('layout-' + color);
		},
    render() {
        return (
          <div className={"col-33 ks-layout-theme ks-layout-"+this.props.color} onClick={this.changeColorTheme.bind(null, this.props.color)}></div>
        );
    }
});

var ColorCell = React.createClass({
		changeColorTheme(color) {
			var themes = 'theme-white theme-black theme-yellow theme-red theme-blue theme-green theme-pink theme-lightblue theme-orange theme-gray';
	    $('body').removeClass(themes).addClass('theme-' + color);
		},
    render() {
        return (
          <div className={"col-20 ks-layout-theme bg-"+this.props.color} onClick={this.changeColorTheme.bind(null, this.props.color)}></div>
        );
    }
});

module.exports = React.createClass({
	render() {
		return (
				<div>
         	<Content.ContentBlock><p>Framework7 comes with default 10 iOS color themes set and three layout color themes (default, dark and pure white):</p></Content.ContentBlock>
          <Content.ContentBlockTitle>Choose Layout Theme</Content.ContentBlockTitle>
          <Content.ContentBlock>
              <Grid.Row>
                  {["default", "dark", "white"].map((color)=>{ return <LayoutCell key={color} color={color}/>})}
              </Grid.Row>
              <Content.ContentBlockTitle>Choose Color Theme</Content.ContentBlockTitle>
              <Grid.Row>
                {["white", "black", "blue", "orange", "red"].map((color)=>{ return <ColorCell key={color} color={color}/>})}
              </Grid.Row>
              </Content.ContentBlock>
              <Content.ContentBlock>
              <Grid.Row>
                {["pink", "green", "lightblue", "yellow", "gray"].map((color)=>{ return <ColorCell key={color} color={color}/>})}
              </Grid.Row>
          </Content.ContentBlock>
        </div>
		);
	}
});
