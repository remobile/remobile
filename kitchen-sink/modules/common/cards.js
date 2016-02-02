var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Card = UI.Card;
var List = UI.List;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Button = UI.Button.Button;

function getImage(i) {
    return 'img/app/photo/'+i+'.jpg';
}

var List1 = React.createClass({
    render() {
        return (
            <List.List block>
                <List.ItemContent>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>Ivan Petrov</List.ItemTitle>
                        <List.ItemAfter>CEO</List.ItemAfter>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>John Doe</List.ItemTitle>
                        <List.ItemAfter><Badge>5</Badge></List.ItemAfter>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>Jenna Smith</List.ItemTitle>
                    </List.ItemInner>
                 </List.ItemContent>
            </List.List>
        );
    }
});


var List2 = React.createClass({
    render() {
        return (
            <List.List block media>
                <List.ItemContent link>
                    <List.ItemMedia><img src={getImage(1)} width="80"/></List.ItemMedia>
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
                    <List.ItemMedia><img src={getImage(2)} width="80"/></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>Don{'\''}t Stop Me Now</List.ItemTitle>
                            <List.ItemAfter>$22</List.ItemAfter>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>Queen</List.ItemSubTitle>
                        <List.ItemText>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.
                        </List.ItemText>
                    </List.ItemInner>
                 </List.ItemContent>
                 <List.ItemContent link>
                    <List.ItemMedia><img src={getImage(3)} width="80"/></List.ItemMedia>
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

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Cards" />
        )
    }
});

module.exports.page = React.createClass({
	render() {
		return (
            <View.PageContent>
                <Content.ContentBlock>
                    <p>Cards, along with List View, is a one more great way to contain and orginize your information. Cards contains unique related data, for example, a photo, text, and link all about a single subject. Cards are typically an entry point to more complex and detailed information.</p>
                </Content.ContentBlock>

                <Content.ContentBlockTitle>Simple Cards</Content.ContentBlockTitle>

                <Card.Card inner>
                    This is simple card with plain text. But card could contain its own header, footer, list view, image, and any elements inside.
                </Card.Card>

                <Card.Card header="Card header" footer="Card Footer" inner>
                    Card with header and footer. Card header is used to display card title and footer for some additional information or for custom actions.
                </Card.Card>

                <Card.Card inner>
                    Another card. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse feugiat sem est, non tincidunt ligula volutpat sit amet. Mauris aliquet magna justo.
                </Card.Card>

                <Content.ContentBlockTitle>Styled Cards</Content.ContentBlockTitle>
                <Card.Card inner
                    customHeader=<Card.CardHeader class="color-white no-border" style={{backgroundImage:"url("+getImage(3)+")"}}>Journey To Mountains</Card.CardHeader>
                    customFooter=<Card.CardFooter><a href="#" class="link">Like</a><a href="#" class="link">Read more</a></Card.CardFooter>
                    >
                    <p class="color-gray">Posted on January 21, 2015</p>
                    <p>Quisque eget vestibulum nulla. Quisque quis dui quis ex ultricies efficitur vitae non felis. Phasellus quis nibh hendrerit...</p>
                </Card.Card>

                <Content.ContentBlockTitle>Facebook Cards</Content.ContentBlockTitle>
                <Card.Card inner
                    class="ks-facebook-card"
                    customHeader=<Card.CardHeader class="no-border">
                    <div class="ks-facebook-avatar"><img src={getImage(1)} width="34" height="34"/></div>
                    <div class="ks-facebook-name">John Doe</div>
                    <div class="ks-facebook-date">Monday at 3:47 PM</div>
                </Card.CardHeader>
                    customFooter=<Card.CardFooter class="no-border"><a href="#" class="link">Like</a><a href="#" class="link">Comment</a><a href="#" class="link">Share</a></Card.CardFooter>
                    >
                    <img src={getImage(8)} width="100%"/>
                </Card.Card>
                <Card.Card inner
                    class="ks-facebook-card"
                    customHeader=<Card.CardHeader>
                    <div class="ks-facebook-avatar"><img src={getImage(1)} width="34" height="34"/></div>
                    <div class="ks-facebook-name">John Doe</div>
                    <div class="ks-facebook-date">Monday at 2:15 PM</div>
                </Card.CardHeader>
                    customFooter=<Card.CardFooter class="no-border"><a href="#" class="link">Like</a><a href="#" class="link">Comment</a><a href="#" class="link">Share</a></Card.CardFooter>
                    >
                    <p>What a nice photo i took yesterday!</p><img src={getImage(8)} width="100%"/>
                    <p class="color-gray">Likes: 112 &nbsp;&nbsp; Comments: 43</p>
                </Card.Card>

                <Content.ContentBlockTitle>Cards With List View</Content.ContentBlockTitle>
                <Card.Card>
                    <List1 />
                </Card.Card>

                <Card.Card header="New Releases:" customFooter=<Card.CardFooter><span>January 20, 2015</span><span>5 comments</span></Card.CardFooter>>
                    <List2 />
                </Card.Card>
            </View.PageContent>
		);
	}
});
