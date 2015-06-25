var React = require('react');
var UI = require('UI');
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;


var photoBrowserPhotos = [
	{
		url: 'img/beach.jpg',
		caption: 'Amazing beach in Goa, India'
	},
  'img/lock.jpg',
  {
      url: 'img/monkey.jpg',
      caption: 'I met this monkey in Chinese mountains'
  },
  {
      url: 'img/mountains.jpg',
      caption: 'Beautiful mountains in Zhangjiajie, China'
  }
    
];

function getImages() {
    var arr = [];
    for (var i=1; i<10; i++) {
        arr.push({
            url: 'img/'+i+'.jpg',
            caption: 'chinese star picture index '+i
        });
    }
    return arr;
}

function showPhoto() {
	var photo = UI.Photo.Photo({
    photos: getImages(),
    lazyLoading: true,
    theme: 'dark'
	});
	photo.open();
}


var ListItem = React.createClass({
		showPage: function(page) {
				app.state.panelVisible = false;
				if (page === 'photo') {
					showPhoto();
				} else {
					app.showView(page, 'left');
				}
		},
    render: function() {
        return (
            <List.ItemContent link onTap={this.showPage.bind(this, this.props.page)}>
                <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                <List.ItemInner>
                    <List.ItemTitle>{this.props.children}</List.ItemTitle>
                </List.ItemInner>
             </List.ItemContent>
        );
    }
});

var MenuList = React.createClass({
    render: function() {
        return (
            <List.List block>
                <ListItem page="button">Button</ListItem>
                <ListItem page="search">Search Bar</ListItem>
                <ListItem page="cards">Cards</ListItem>
                <ListItem page="panels">Slide Panels</ListItem>
                <ListItem page="swiper">Swiper Slider</ListItem>
                <ListItem page="notifications">Notifications</ListItem>
                <ListItem page="messages">Messages</ListItem>
                <ListItem page="list">List</ListItem>
                <ListItem page="medialist">Media List</ListItem>
                <ListItem page="photo">Photo Browser</ListItem>
                <ListItem page="grid">Grid</ListItem>
                <ListItem page="radioSelect">Radio Select</ListItem>
                <ListItem page="checkboxSelect">Checkbox Select</ListItem>
                <ListItem page="form">Form</ListItem>
                <ListItem page="picker">Picker</ListItem>
                <ListItem page="pickerEx">Picker2</ListItem>
                <ListItem page="popover">Popover</ListItem>
                <ListItem page="modals">Modals</ListItem>
                <ListItem page="calendar">Calendar</ListItem>
                <ListItem page="preloader">Preloader</ListItem>
                <ListItem page="tabs">Tabs</ListItem>
                <ListItem page="icons">Icons</ListItem>
            </List.List>
        );
    }
});

module.exports = React.createClass({
	render: function() {
		return (
            <div>
                <Content.ContentBlockTitle>React-mobile Kitchen Sink</Content.ContentBlockTitle>
                <MenuList />
            </div>
		);
	}
});
module.exports.MenuList = MenuList;
