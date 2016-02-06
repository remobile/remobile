var React = require('react');
var UI = require('UI');
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;

function getImages() {
    var arr = [];
    for (var i=1; i<10; i++) {
        arr.push({
            url: 'img/app/photo/'+i+'.jpg',
            caption: 'chinese star picture index '+i
        });
    }
    return arr;
}

function showPhoto() {
    var photo = app.photoBrowser({
        photos: getImages(),
        lazyLoading: true,
        theme: 'dark'
    });
    photo.open();
}


var ListItem = React.createClass({
    showPage(page) {
        if (page === 'photo') {
            showPhoto();
        } else if (page === 'page1') {
            app.showView(page, {text:'Are you page 1'});
        } else {
            app.showView(page);
        }
    },
    render() {
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
    render() {
        return (
            <List.List block>
            	<ListItem page="page1">Test Trans Params</ListItem>
            	<ListItem page="colorThemes">Color Themes</ListItem>
                <ListItem page="virtualList">Virtual List</ListItem>
                <ListItem page="lazyLoad">Lazy Load Image</ListItem>
                <ListItem page="button">Button</ListItem>
                <ListItem page="upscroller">Up Scroller</ListItem>
                <ListItem page="chip">Chips</ListItem>
                <ListItem page="panels">Side Panels</ListItem>
                <ListItem page="panels3d">3D Panels</ListItem>
                <ListItem page="floatingButton">Floating Button</ListItem>
                <ListItem page="toast">Toast</ListItem>
                <ListItem page="sortableList">Sortable List</ListItem>
                <ListItem page="progressBar">Progress Bar</ListItem>
                <ListItem page="autocomplete">Autocomplete</ListItem>
                <ListItem page="barsHideOnScroll">Bars Hide On Scroll</ListItem>
                <ListItem page="subbarsHideOnScroll">SubNavbar Hide On Scroll</ListItem>
                <ListItem page="swipeDelete">Swipe Delete</ListItem>
                <ListItem page="pullToRefresh">Pull To Refresh</ListItem>
                <ListItem page="infiniteScroll">Infinite Scroll</ListItem>
                <ListItem page="accordion">Accordion</ListItem>
                <ListItem page="search">Search Bar</ListItem>
                <ListItem page="cards">Cards</ListItem>
                <ListItem page="swiper">Swiper Slider</ListItem>
                <ListItem page="notifications">Notifications</ListItem>
                <ListItem page="list">List</ListItem>
                <ListItem page="medialist">Media List</ListItem>
                <ListItem page="photo">Photo Browser</ListItem>
                <ListItem page="grid">Grid</ListItem>
                <ListItem page="radioCheckBox">Radio And Checkbox</ListItem>
                <ListItem page="form">Form</ListItem>
                <ListItem page="picker">Picker</ListItem>
                <ListItem page="cityPicker">City Picker</ListItem>
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
	render() {
		return (
            <div>
                <Content.ContentBlockTitle>React-mobile Kitchen Sink</Content.ContentBlockTitle>
                <MenuList />
            </div>
		);
	}
});
