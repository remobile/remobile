var React = require('react');
var UI = require('UI');
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;

var ListItem = React.createClass({
	showPage(page) {
			app.showView(page);
	},
    render() {
        return (
            <List.ItemContent link onTap={this.showPage.bind(this, this.props.page)}>
                <List.ItemInner>
                    <List.ItemTitle>{this.props.children}</List.ItemTitle>
                </List.ItemInner>
             </List.ItemContent>
        );
    }
});

var List1 = React.createClass({
    render() {
        return (
            <List.List block>
                <ListItem page="swiperHorizontal">Swiper Horizontal</ListItem>
                <ListItem page="swiperVertical">Swiper Vertical</ListItem>
                <ListItem page="swiperSpaceBetween">Space Between Slides</ListItem>
                <ListItem page="swiperMultiple">Multiple Per Page</ListItem>
                <ListItem page="swiperNested">Nested Swipers</ListItem>
                <ListItem page="swiperLoop">Infinite Loop Mode</ListItem>
                <ListItem page="swiper3dCube">3D Cube Effect</ListItem>
                <ListItem page="swiper3dCoverflow">3D Coverflow Effect</ListItem>
                <ListItem page="swiper3dFlip">3D Flip Effect</ListItem>
                <ListItem page="swiperFade">Fade Effect</ListItem>
                <ListItem page="swiperScrollbar">With Scrollbar</ListItem>
                <ListItem page="swiperGallery">Two Way Control Gallery</ListItem>
                <ListItem page="swiperCustom">Custom Controls</ListItem>
                <ListItem page="swiperParallax">Parallax</ListItem>
                <ListItem page="swiperLazy">Lazy Loading</ListItem>
                <ListItem page="swiperProgressPagination">Progress Pagination</ListItem>
                <ListItem page="swiperFractionPagination">Fraction Pagination</ListItem>
            </List.List>
        );
    }
});

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Swiper" />
        )
    }
});

module.exports.page = React.createClass({
	render() {
		return (
			<View.PageContent>
			    <Content.ContentBlock>
			    	<p>Framework7 comes with powerful and most modern touch slider ever - <a href="http://idangero.us/sliders/swiper">Swiper Slider</a> with super flexible configuration and lot, lot of features. Just check the following demos:</p>
			    </Content.ContentBlock>
			    <List1 />
			</View.PageContent>
		);
	}
});
