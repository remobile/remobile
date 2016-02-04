var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var List = UI.List;
var Button = UI.Button.Button;
var Icon = UI.Icon.Icon;

var persons = [
	'Acura',
	'Audi',
	'BMW',
	'Cadillac ',
	'Chevrolet ',
	'Chrysler ',
	'Dodge ',
	'Ferrari ',
	'Ford ',
	'GMC ',
	'Honda',
	'Hummer',
	'Hyundai',
	'Infiniti ',
	'Isuzu ',
	'Jaguar ',
	'Jeep ',
	'Kia',
	'Lamborghini ',
	'Land Rover',
	'Lexus ',
	'Lincoln ',
	'Lotus ',
	'Mazda',
	'Mercedes-Benz',
	'Mercury ',
	'Mitsubishi',
	'Nissan ',
	'Oldsmobile ',
	'Peugeot ',
	'Pontiac ',
	'Porsche',
	'Regal',
	'Saab ',
	'Saturn ',
	'Subaru ',
	'Suzuki ',
	'Toyota',
	'Volkswagen',
	'Volvo'
];



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
            <View.Navbar title="Search" />
        )
    }
});

module.exports.page = React.createClass({
    componentDidMount() {
        var container = $(this.refs.searchbar.getDOMNode());
        var params = {
            searchList: $(this.refs.searchlist.getDOMNode()).find('.searchbar-found')
        };
        this.searchbar = app.searchbar(container, params);
    },
    componentWillUnmount() {
        this.searchbar.destroy();
    },
    render() {
        return (
            <View.Page>
                <UI.Search.Search ref="searchbar"/>
                <UI.Search.SearchOverlay />
                <View.PageContent>
                    <UI.Search.SearchList ref="searchlist">
                        {persons.map((person, i)=>{return <ListItem key={i}>{person}</ListItem>})}
                    </UI.Search.SearchList>
                </View.PageContent>
            </View.Page>
        );
    }
});
