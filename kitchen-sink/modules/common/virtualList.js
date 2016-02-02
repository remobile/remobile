var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var List = UI.List;
var Button = UI.Button.Button;
var Icon = UI.Icon.Icon;


var ListItem = React.createClass({
    render() {
        return (
            <List.ItemContent link>
                <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                <List.ItemInner>
                    <List.ItemTitle>{this.props.children}</List.ItemTitle>
                </List.ItemInner>
             </List.ItemContent>
        );
    }
});

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Virtal List" />
        )
    }
});

module.exports.page = React.createClass({
    componentDidMount() {
        var items = [];
        for (var i = 0; i < 10000; i++) {
            items.push({
                title: 'Item ' + i,
                subtitle: 'Subtitle ' + i
            });
        }

        var searchlist = $(this.refs.searchlist.getDOMNode());
        var searchbar = $(this.refs.searchbar.getDOMNode());
        var virtualList = app.virtualList(searchlist.find('.virtual-list'), {
            // Pass array with items
            items: items,
            // Custom search function for searchbar
            searchAll: function (query, items) {
                var found = [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i].title.indexOf(query) >= 0 || query.trim() === '') found.push(i);
                }
                return found; //return array with mathced indexes
            },
            // List item Template7 template
            template: '<li>' +
                        '<a href="#" class="item-link item-content">' +
                          '<div class="item-inner">' +
                            '<div class="item-title-row">' +
                              '<div class="item-title">{{title}}</div>' +
                            '</div>' +
                            '<div class="item-subtitle">{{subtitle}}</div>' +
                          '</div>' +
                        '</a>' +
                      '</li>',
            // Item height
            height: 63,
        });

        var params = {
            searchList: searchlist.find('.searchbar-found')
        };
        this.searchbar = app.searchbar(searchbar, params);
    },
    componentWillUnmount() {
        this.searchbar.destroy();
    },
    render() {
        return (
            <View.Page title="Virtal List">
                <UI.Search.Search ref="searchbar"/>
                <UI.Search.SearchOverlay />
                <View.PageContent>
                    <Content.ContentBlock>
                      <p>Virtual List allows to render lists with huge amount of elements without loss of performance. And it is fully compatible with all Framework7 list components such as Search Bar, Infinite Scroll, Pull To Refresh, Swipeouts (swipe-to-delete) and Sortable.</p>
                      <p>Here is the example of virtual list with 10 000 items:</p>
                    </Content.ContentBlock>
                    <UI.Search.SearchList ref="searchlist" virtual media></UI.Search.SearchList>
                </View.PageContent>
            </View.Page>
        );
    }
});
