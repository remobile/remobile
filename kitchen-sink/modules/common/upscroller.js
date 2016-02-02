var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;

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
            <List.List block>
                <List.ItemContent link>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>Ivan Petrov</List.ItemTitle>
                        <List.ItemAfter>CEO</List.ItemAfter>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent link>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>John Doe</List.ItemTitle>
                        <List.ItemAfter><Badge>5</Badge></List.ItemAfter>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent link>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>Jenna Smith</List.ItemTitle>
                    </List.ItemInner>
                 </List.ItemContent>
            </List.List>
        );
    }
});

var List3 = React.createClass({
    render() {
        return (
            <List.List block>
                <List.ItemContent link>
                    <List.ItemInner>
                        <List.ItemTitle>Ivan Petrov</List.ItemTitle>
                        <List.ItemAfter>CEO</List.ItemAfter>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent link>
                    <List.ItemInner>
                        <List.ItemTitle>John Doe</List.ItemTitle>
                        <List.ItemAfter><Badge>5</Badge></List.ItemAfter>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemDivider>Divider Here</List.ItemDivider>
                <List.ItemContent link>
                    <List.ItemInner>
                        <List.ItemTitle>Jenna Smith</List.ItemTitle>
                    </List.ItemInner>
                 </List.ItemContent>
            </List.List>
        );
    }
});


var List4 = React.createClass({
    render() {
        return (
            <List.List block group>
                <List.ListGroup>
                    <List.ListGroupTitle>A</List.ListGroupTitle>
                    <List.ItemContent>
                        <List.ItemInner>
                            <List.ItemTitle>Aaron</List.ItemTitle>
                        </List.ItemInner>
                     </List.ItemContent>
                    <List.ItemContent>
                        <List.ItemInner>
                            <List.ItemTitle>Abbie</List.ItemTitle>
                        </List.ItemInner>
                     </List.ItemContent>
                    <List.ItemContent>
                        <List.ItemInner>
                            <List.ItemTitle>Adam</List.ItemTitle>
                        </List.ItemInner>
                     </List.ItemContent>
                    <List.ListGroupTitle>B</List.ListGroupTitle>
                    <List.ItemContent>
                        <List.ItemInner>
                            <List.ItemTitle>Bailey</List.ItemTitle>
                        </List.ItemInner>
                     </List.ItemContent>
                    <List.ItemContent>
                        <List.ItemInner>
                            <List.ItemTitle>Barclay</List.ItemTitle>
                        </List.ItemInner>
                     </List.ItemContent>
                    <List.ItemContent>
                        <List.ItemInner>
                            <List.ItemTitle>Bartolo</List.ItemTitle>
                        </List.ItemInner>
                     </List.ItemContent>
                    <List.ListGroupTitle>C</List.ListGroupTitle>
                    <List.ItemContent>
                        <List.ItemInner>
                            <List.ItemTitle>Caiden</List.ItemTitle>
                        </List.ItemInner>
                     </List.ItemContent>
                    <List.ItemContent>
                        <List.ItemInner>
                            <List.ItemTitle>Calvin</List.ItemTitle>
                        </List.ItemInner>
                     </List.ItemContent>
                    <List.ItemContent>
                        <List.ItemInner>
                            <List.ItemTitle>Candy</List.ItemTitle>
                        </List.ItemInner>
                     </List.ItemContent>
                </List.ListGroup>
            </List.List>
        );
    }
});

var List5 = React.createClass({
    render() {
        return (
            <List.List block>
                <List.ItemContent link>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>Ivan Petrov</List.ItemTitle>
                        <List.ItemAfter>CEO</List.ItemAfter>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent link>
                    <List.ItemMedia><Icon name="icon-f7" /><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>Two icons here</List.ItemTitle>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent>
                    <List.ItemInner>
                        <List.ItemTitle>No icons here</List.ItemTitle>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.SubList>
                    <List.ItemContent link>
                        <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                        <List.ItemInner>
                            <List.ItemTitle>Ivan Petrov</List.ItemTitle>
                            <List.ItemAfter>CEO</List.ItemAfter>
                        </List.ItemInner>
                     </List.ItemContent>
                    <List.ItemContent link>
                        <List.ItemMedia><Icon name="icon-f7" /><Icon name="icon-f7" /></List.ItemMedia>
                        <List.ItemInner>
                            <List.ItemTitle>Two icons here</List.ItemTitle>
                        </List.ItemInner>
                     </List.ItemContent>
                    <List.ItemContent>
                        <List.ItemInner>
                            <List.ItemTitle>No icons here</List.ItemTitle>
                        </List.ItemInner>
                     </List.ItemContent>
                    <List.ItemContent link>
                        <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                        <List.ItemInner>
                            <List.ItemTitle>Ultra long text goes here, no, it is really really long</List.ItemTitle>
                        </List.ItemInner>
                     </List.ItemContent>
                    <List.ItemContent>
                        <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                        <List.ItemInner>
                            <List.ItemTitle>With switch</List.ItemTitle>
                            <List.ItemAfter><Form.Switch /></List.ItemAfter>
                        </List.ItemInner>
                     </List.ItemContent>
                </List.SubList>
                <List.ItemContent link>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>Ultra long text goes here, no, it is really really long</List.ItemTitle>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>With switch</List.ItemTitle>
                        <List.ItemAfter><Form.Switch /></List.ItemAfter>
                    </List.ItemInner>
                 </List.ItemContent>
            </List.List>
        );
    }
});

var List7 = React.createClass({
    render() {
        return (
            <List.List block tabletInset>
                <List.ItemContent link>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>Ivan Petrov</List.ItemTitle>
                        <List.ItemAfter>CEO</List.ItemAfter>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent link>
                    <List.ItemMedia><Icon name="icon-f7" /><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>Two icons here</List.ItemTitle>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent link>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>Ultra long text goes here, no, it is really really long</List.ItemTitle>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ListBlockLabel> This list block will look like "inset" only on tablets (iPad) </List.ListBlockLabel>
            </List.List>
        );
    }
});


var List6 = React.createClass({
    render() {
        return (
            <List.List block inset>
                <List.ItemContent link>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>Ivan Petrov</List.ItemTitle>
                        <List.ItemAfter>CEO</List.ItemAfter>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent link>
                    <List.ItemMedia><Icon name="icon-f7" /><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>Two icons here</List.ItemTitle>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent link>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>Ultra long text goes here, no, it is really really long</List.ItemTitle>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>With switch</List.ItemTitle>
                        <List.ItemAfter><Form.Switch /></List.ItemAfter>
                    </List.ItemInner>
                 </List.ItemContent>
            </List.List>
        );
    }
});

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Up Scroller" />
        )
    }
});

module.exports.page = React.createClass({
    componentDidMount() {
		app.initUpScroller(this.getDOMNode());
	},
	render() {
		return (
			<View.PageContent>
                <Content.ContentBlock>
                  <p>Framework7 allows you to be flexible with list views (table views). You can make them as navigation menus, you can use there icons, inputs, and any elements inside of the list, and even make them nested:</p>
                </Content.ContentBlock>
                <Content.ContentBlockTitle>Data list, with icons</Content.ContentBlockTitle>
                <List1 />
                <Content.ContentBlockTitle>Links</Content.ContentBlockTitle>
                <List2 />
                <Content.ContentBlockTitle>Links, no icons</Content.ContentBlockTitle>
                <List3 />
                <Content.ContentBlockTitle>Grouped with sticky titles</Content.ContentBlockTitle>
                <List4 />
                <Content.ContentBlockTitle>Mixed and nested</Content.ContentBlockTitle>
                <List5 />
                <Content.ContentBlockTitle>Mixed, inset</Content.ContentBlockTitle>
                <List6 />
                <Content.ContentBlockTitle>Here comes some useful information about list above</Content.ContentBlockTitle>
                <List7 />
          </View.PageContent>
		);
	}
});
