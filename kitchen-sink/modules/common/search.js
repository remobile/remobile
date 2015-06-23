var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var PopoverModal = UI.Modal.PopoverModal;
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
    render: function() {
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



module.exports = React.createClass({
	componentDidMount: function() {
  	var container = $(this.refs.searchbar.getDOMNode());
  	var params = {
  		searchList: $(this.refs.searchlist.getDOMNode()).find('.searchbar-found')
  	};
  	this.props.searchbar = UI.Search.Search.Searchbar(container, params);		
  },
  componentWillUnmount: function() {
		this.props.searchbar.destroy();
	},
	render: function() {
		return (
			<View.Page title="Search">
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
