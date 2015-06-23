var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;

var List1 = React.createClass({
    render: function() {
        return (
            <List.List block media>
                <List.ItemContent link>
                    <List.ItemMedia><img src="http://lorempixel.com/160/160/people/1" width="80"/></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>Yellow Submarine</List.ItemTitle>
                            <List.ItemAfter>$15</List.ItemAfter>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>Beatles</List.ItemSubTitle>
                        <List.ItemText>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.
                        </List.ItemText>
                    </List.ItemInner>
                 </List.ItemContent>
                 <List.ItemContent link>
                    <List.ItemMedia><img src="http://lorempixel.com/160/160/people/2" width="80"/></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>Don't Stop Me Now</List.ItemTitle>
                            <List.ItemAfter>$22</List.ItemAfter>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>Queen</List.ItemSubTitle>
                        <List.ItemText>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.
                        </List.ItemText>
                    </List.ItemInner>
                 </List.ItemContent>
                 <List.ItemContent link>
                    <List.ItemMedia><img src="http://lorempixel.com/160/160/people/3" width="80"/></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>Billie Jean</List.ItemTitle>
                            <List.ItemAfter>$16</List.ItemAfter>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>Michael Jackson</List.ItemSubTitle>
                        <List.ItemText>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.
                        </List.ItemText>
                    </List.ItemInner>
                 </List.ItemContent>
            </List.List>
        );
    }
});

var List2 = React.createClass({
    render: function() {
        return (
            <List.List block media>
                <List.ItemContent link>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>Facebook</List.ItemTitle>
                            <List.ItemAfter>17:14</List.ItemAfter>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>New messages from John Doe</List.ItemSubTitle>
                        <List.ItemText>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.
                        </List.ItemText>
                    </List.ItemInner>
                 </List.ItemContent>
                 <List.ItemContent link>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>John Doe (via Twitter)</List.ItemTitle>
                            <List.ItemAfter>18:50</List.ItemAfter>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>John Doe (@_johndoe) mentioned you on Twitter!</List.ItemSubTitle>
                        <List.ItemText>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.
                        </List.ItemText>
                    </List.ItemInner>
                 </List.ItemContent>
                 <List.ItemContent link>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>Facebook</List.ItemTitle>
                            <List.ItemAfter>20:20</List.ItemAfter>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>New messages from John Do</List.ItemSubTitle>
                        <List.ItemText>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.
                        </List.ItemText>
                    </List.ItemInner>
                 </List.ItemContent>
            </List.List>
        );
    }
});

var List3 = React.createClass({
    render: function() {
        return (
            <List.List block media>
                <List.ItemContent link>
                    <List.ItemMedia><img src="http://lorempixel.com/88/88/fashion/1" width="44"/></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>Yellow Submarine</List.ItemTitle>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>Beatles</List.ItemSubTitle>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent link>
                    <List.ItemMedia><img src="http://lorempixel.com/88/88/fashion/2" width="44"/></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>Don't Stop Me Now</List.ItemTitle>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>Queen</List.ItemSubTitle>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent link>
                    <List.ItemMedia><img src="http://lorempixel.com/88/88/fashion/3" width="44"/></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>Billie Jean</List.ItemTitle>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>Michael Jackson</List.ItemSubTitle>
                    </List.ItemInner>
                 </List.ItemContent>
            </List.List>
        );
    }
});

var List4 = React.createClass({
    render: function() {
        return (
            <List.List block media inset>
                <List.ItemContent link>
                    <List.ItemMedia><img src="http://lorempixel.com/88/88/fashion/4" width="44"/></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>Yellow Submarine</List.ItemTitle>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>Beatles</List.ItemSubTitle>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent link>
                    <List.ItemMedia><img src="http://lorempixel.com/88/88/fashion/5" width="44"/></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>Don't Stop Me Now</List.ItemTitle>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>Queen</List.ItemSubTitle>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent link>
                    <List.ItemMedia><img src="http://lorempixel.com/88/88/fashion/6" width="44"/></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>Billie Jean</List.ItemTitle>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>Michael Jackson</List.ItemSubTitle>
                    </List.ItemInner>
                 </List.ItemContent>
            </List.List>
        );
    }
});



module.exports = React.createClass({
	render: function() {
		return (
			<View.Page title="MediaList">
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
       </View.Page>
		);
	}
});
