var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var Button = UI.Button.Button;
var MenuList = require('../home/pages/main').MenuList;


var LeftPanel = React.createClass({
	render: function() {
		return (
				<div>
					<Content.ContentBlockTitle>Left Panel</Content.ContentBlockTitle>
		      <Content.ContentBlock>
		        <p>This is a side panel. You can close it by clicking outsite or on this link: <Button onTap={app.hidePanel}>close me</Button>. You can put here anything, even another isolated view like in <Button onTap={showRightPanelFromLeft}>Right Panel</Button></p>
		      </Content.ContentBlock>
		      <Content.ContentBlockTitle>Framework7 Kitchen Sink</Content.ContentBlockTitle>
		      
		      <MenuList />
		      
		      <Content.ContentBlock>
		        <p>Long text block goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sem urna, gravida non scelerisque id, fringilla ac velit. Phasellus elementum a ipsum at ornare. Mauris sagittis rhoncus euismod. Integer convallis augue eu lacus ultrices, in dictum elit consequat. Nulla faucibus massa id felis egestas eleifend. Proin consequat dignissim magna ut scelerisque. Vestibulum ac lorem semper, posuere sapien nec, pharetra massa. Nulla a tellus facilisis, sollicitudin quam porta, aliquam lorem. Fusce dignissim eros ac diam molestie, ut ultrices lorem tristique. Ut facilisis augue ac nisi egestas malesuada. Nunc posuere tortor quis eleifend mollis. Aliquam erat volutpat. Donec feugiat elit tellus, nec convallis orci elementum in. Sed urna mi, vestibulum id tempus id, pretium et ante. Pellentesque eget sollicitudin ligula. Phasellus pellentesque velit eu porta suscipit.</p>
		      </Content.ContentBlock>
		    </div>
     )
	}
});


var RightPanel = React.createClass({
	render: function() {
		return (
				<div>
		      <Content.ContentBlock>
		        <p>Long text block goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sem urna, gravida non scelerisque id, fringilla ac velit. Phasellus elementum a ipsum at ornare. Mauris sagittis rhoncus euismod. Integer convallis augue eu lacus ultrices, in dictum elit consequat. Nulla faucibus massa id felis egestas eleifend. Proin consequat dignissim magna ut scelerisque. Vestibulum ac lorem semper, posuere sapien nec, pharetra massa. Nulla a tellus facilisis, sollicitudin quam porta, aliquam lorem. Fusce dignissim eros ac diam molestie, ut ultrices lorem tristique. Ut facilisis augue ac nisi egestas malesuada. Nunc posuere tortor quis eleifend mollis. Aliquam erat volutpat. Donec feugiat elit tellus, nec convallis orci elementum in. Sed urna mi, vestibulum id tempus id, pretium et ante. Pellentesque eget sollicitudin ligula. Phasellus pellentesque velit eu porta suscipit.</p>
		      </Content.ContentBlock>
		    </div>
     )
	}
});

function showLeftPanel() {
	app.showPanel('left', <LeftPanel />);
}


function showRightPanel() {
	app.showPanel('right', <RightPanel />);
}

function showRightPanelFromLeft() {
	app.hidePanel();
	setTimeout(function() {
		showRightPanel();
	}, 500);
}

module.exports = React.createClass({
	render: function() {
		return (
			<View.Page title="Side Panels">
				<View.PageContent>

		      <Content.ContentBlock>
		        <p>Framework7 comes with 2 panels (on left and on right), both are optional. They have two different layouts/effects - <b>cover</b> above the content (like left panel here) and <b>reveal</b> (like right panel). You can put absolutely anything inside: data lists, forms, custom content, and even other isolated app view (like in right panel now) with its own dynamic navbar. Checkout panels:</p>
		      </Content.ContentBlock>
		      <Content.ContentBlock>
		        <Grid.Row>
		          <Grid.Col per={50}><Button onTap={showLeftPanel}>Left Panel</Button></Grid.Col>
		          <Grid.Col per={50}><Button onTap={showRightPanel}>Right Panel</Button></Grid.Col>
		        </Grid.Row>
		      </Content.ContentBlock>
	        
				</View.PageContent>
       </View.Page>
		);
	}
});
