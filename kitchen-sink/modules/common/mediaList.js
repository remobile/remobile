var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;

function getImage(i) {
    return 'img/app/photo/'+i+'.jpg';
}

var List1 = React.createClass({
    render() {
        return (
            <List.List block media>
            	{[{name:"Yellow Submarine", price:"$15", title:"Beatles"},
            		{name:"Don't Stop Me Now", price:"$22", title:"Queen"},
            		{name:"Billie Jean", price:"$16", title:"Michael Jackson"}].map((item, i)=>{return (
            		<List.ItemContent link>
                    <List.ItemMedia><img src={getImage(i+1)} width="80"/></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>{item.name}</List.ItemTitle>
                            <List.ItemAfter>{item.price}</List.ItemAfter>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>{item.title}</List.ItemSubTitle>
                        <List.ItemText>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.
                        </List.ItemText>
                    </List.ItemInner>
                 </List.ItemContent>
             	)})}
            </List.List>
        );
    }
});

var List2 = React.createClass({
    render() {
        return (
            <List.List block media>
            	{[{name:"Facebook", time:"17:14", title:"New messages from John Doe"},
            		{name:"John Doe (via Twitter)", time:"18:50", title:"John Doe (@_johndoe) mentioned you on Twitter!"},
            		{name:"Facebook", time:"20:20", title:"New messages from John Do"}].map((item, i)=>{return (
            		<List.ItemContent link>
                    <List.ItemMedia><img src={getImage(i+1)} width="80"/></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>{item.name}</List.ItemTitle>
                            <List.ItemAfter>{item.time}</List.ItemAfter>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>{item.title}</List.ItemSubTitle>
                        <List.ItemText>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.
                        </List.ItemText>
                    </List.ItemInner>
                 </List.ItemContent>
             	)})}
            </List.List>
        );
    }
});

var List3 = React.createClass({
    render() {
        return (
            <List.List block media>
            	{[{name:"Yellow Submarine", price:"$15", title:"Beatles"},
            		{name:"Don't Stop Me Now", price:"$22", title:"Queen"},
            		{name:"Billie Jean", price:"$16", title:"Michael Jackson"}].map((item, i)=>{return (
            		<List.ItemContent link>
                    <List.ItemMedia><img src={getImage(i+1)} width="44"/></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>{item.name}</List.ItemTitle>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>{item.title}</List.ItemSubTitle>
                    </List.ItemInner>
                 </List.ItemContent>
             	)})}
            </List.List>
        );
    }
});

var List4 = React.createClass({
    render() {
        return (
            <List.List block media inset>
              {[{name:"Yellow Submarine", price:"$15", title:"Beatles"},
            		{name:"Don't Stop Me Now", price:"$22", title:"Queen"},
            		{name:"Billie Jean", price:"$16", title:"Michael Jackson"}].map((item, i)=>{return (
            		<List.ItemContent link>
                    <List.ItemMedia><img src={getImage(i+1)} width="44"/></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>{item.name}</List.ItemTitle>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>{item.title}</List.ItemSubTitle>
                    </List.ItemInner>
                 </List.ItemContent>
             	)})}
            </List.List>
        );
    }
});

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Media List" />
        )
    }
});

module.exports.page = React.createClass({
	render() {
		return (
			<View.PageContent>
                <Content.ContentBlock>
                    <p>Media Lists are almost the same as Data Lists, but with a more flexible layout for visualization of mor complex data, like products, services, userc, etc. You can even use them in <a href="#" data-popover=".popover-music" class="open-popover">popovers</a></p>
                </Content.ContentBlock>
                <Content.ContentBlockTitle>Songs</Content.ContentBlockTitle>
                <List1 />
                <Content.ContentBlockTitle>Mail App (With Swipe to delete and overswipes)</Content.ContentBlockTitle>
                <List2 />
                <Content.ContentBlockTitle>Something more simple</Content.ContentBlockTitle>
                <List3 />
                <Content.ContentBlockTitle>Inset</Content.ContentBlockTitle>
                <List4 />
            </View.PageContent>
		);
	}
});
