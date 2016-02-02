var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var List = UI.List;

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Picker" />
        )
    }
});

module.exports.page = React.createClass({
	componentDidMount() {
		var today = new Date();
		// Dependent values
		var provinces = require('../../data/city-data.js');
		var cities, areas;
		var pickerDependent = app.picker({
			input: '#ks-picker-city',
			rotateEffect: true,
			formatValue(picker, values, displayValues) {
				return displayValues[0] + ' ' + values[1] + ' ' + values[2];
			},
			cols: [
				{
					textAlign: 'left',
					values: _.map(provinces, (province)=> {return province.text}),
					onChange(picker, province) {
						cities = _.findWhere(provinces, {text:province}).children;
						if(picker.cols[1].replaceValues){
							picker.cols[1].replaceValues(_.map(cities, (city)=> {return city.text}));
						}
					}
				},
				{
					textAlign: 'left',
					values: _.map(provinces[0].children, (city)=> {return city.text}),
					onChange(picker, city) {
						if(picker.cols[2].replaceValues){
							areas = _.findWhere(cities, {text:city}).children;
							picker.cols[2].replaceValues(_.map(areas, (area)=> {return area.text}));
						}
					}
				},
				{
					values: _.map(provinces[0].children[0].children, (area)=> {return area.text}),
				},
			]
		});

		// Inline date-time
		var pickerInline = app.picker({
			input: '#ks-picker-address',
			container: '#ks-picker-address-container',
			toolbar: false,
			rotateEffect: true,
			value: ['北京市', '北京市', ' 西城区'],
			onChange(picker, values, displayValues) {
			},
			formatValue(p, values, displayValues) {
				return displayValues[0] + ' ' + values[1] + ' ' + values[2];
			},
			cols: [
				{
					textAlign: 'left',
					values: _.map(provinces, (province)=> {return province.text}),
					onChange(picker, province) {
						cities = _.findWhere(provinces, {text:province}).children;
						if(picker.cols[1].replaceValues){
							picker.cols[1].replaceValues(_.map(cities, (city)=> {return city.text}));
						}
					}
				},
				{
					textAlign: 'left',
					values: _.map(provinces[0].children, (city)=> {return city.text}),
					onChange(picker, city) {
						if(picker.cols[2].replaceValues){
							areas = _.findWhere(cities, {text:city}).children;
							picker.cols[2].replaceValues(_.map(areas, (area)=> {return area.text}));
						}
					}
				},
				{
					values: _.map(provinces[0].children[0].children, (area)=> {return area.text}),
				},
			]
		});
	},
	render() {
		return (
			<View.PageContent>
				<Content.ContentBlock>
					<p>
						Picker is a powerful component that allows you to create custom overlay pickers which looks like iOS native picker.
					</p>
					<p>
						Picker could be used as inline component or as overlay. Overlay Picker will be automatically converted to Popover on tablets (iPad).
					</p>
				</Content.ContentBlock>
				<Content.ContentBlockTitle>
					City
				</Content.ContentBlockTitle>
				<List.List>
					<List.ItemContent>
						<List.ItemInner>
							<List.ItemInput>
								<input
									type="text"
									placeholder="Your Address"
									readonly="readonly"
									id="ks-picker-city"/>
							</List.ItemInput>
						</List.ItemInner>
					</List.ItemContent>
				</List.List>
				<Content.ContentBlockTitle>
					Address
				</Content.ContentBlockTitle>
				<List.List>
					<List.ItemContent>
						<List.ItemInner>
							<List.ItemInput>
								<input
									type="text"
									placeholder="My Address"
									readonly="readonly"
									id="ks-picker-address"/>
							</List.ItemInput>
						</List.ItemInner>
					</List.ItemContent>
				</List.List>
				<div id="ks-picker-address-container">
				</div>
			</View.PageContent>
		);
	}
});
