var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var List = UI.List;

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Dropdown Autocomplete" />
        )
    }
});

module.exports.page = React.createClass({
	componentDidMount() {
		// Fruits data demo array
    var fruits = ('Apple Apricot Avocado Banana Melon Orange Peach Pear Pineapple').split(' ');

    // Simple Dropdown
    var autocompleteDropdownSimple = app.autocomplete({
        input: '#autocomplete-dropdown',
        openIn: 'dropdown',
        source(autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });

    // Dropdown with input expand
    var autocompleteDropdownExpand = app.autocomplete({
        input: '#autocomplete-dropdown-expand',
        openIn: 'dropdown',
        expandInput: true, // expand input
        source(autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });

    // Dropdown with all values
    var autocompleteDropdownAll = app.autocomplete({
        input: '#autocomplete-dropdown-all',
        openIn: 'dropdown',
        source(autocomplete, query, render) {
            var results = [];
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });

    // Dropdown with placeholder
    var autocompleteDropdownPlaceholder = app.autocomplete({
        input: '#autocomplete-dropdown-placeholder',
        openIn: 'dropdown',
        dropdownPlaceholderText: 'Try to type "Apple"',
        source(autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });

    // Dropdown with ajax data
    var autocompleteDropdownAjax = app.autocomplete({
        input: '#autocomplete-dropdown-ajax',
        openIn: 'dropdown',
        preloader: true, //enable preloader
        valueProperty: 'id', //object's "value" property name
        textProperty: 'name', //object's "text" property name
        limit: 20, //limit to 20 results
        dropdownPlaceholderText: 'Try "JavaScript"',
        expandInput: true, // expand input
        source(autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Show Preloader
            autocomplete.showPreloader();
            // Do Ajax request to Autocomplete data
            $.ajax({
                url: 'data/autocomplete-languages.json',
                method: 'GET',
                dataType: 'json',
                //send "query" to server. Useful in case you generate response dynamically
                data: {
                    query: query
                },
                success(data) {
                    // Find matched items
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
                    }
                    // Hide Preoloader
                    autocomplete.hidePreloader();
                    // Render items by passing array with result items
                    render(results);
                }
            });
        }
    });

    // Simple Standalone
    var autocompleteStandaloneSimple = app.autocomplete({
        openIn: 'page', //open in page
        opener: $('#autocomplete-standalone'), //link that opens autocomplete
        backOnSelect: true, //go back after we select something
        source(autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        },
        onChange(autocomplete, value) {
            // Add item text value to item-after
            $('#autocomplete-standalone').find('.item-after').text(value[0]);
            // Add item value to input value
            $('#autocomplete-standalone').find('input').val(value[0]);
        }
    });
	},
	render() {
		return (
			<View.PageContent>
				<Content.ContentBlock>
					<p>
						Dropdown autocomplete is good to use as a quick and simple solution to provide more options in addition to free-type value.
					</p>
				</Content.ContentBlock>
				<Content.ContentBlockTitle>
					Simple Dropdown Autocomplete
				</Content.ContentBlockTitle>
				<List.List>
					<List.ItemContent>
						<List.ItemInner>
							<List.ItemTitle label>Fruit</List.ItemTitle>
							<List.ItemInput>
								<input
									type="text"
									placeholder="Fruit"
									id="autocomplete-dropdown"/>
							</List.ItemInput>
						</List.ItemInner>
					</List.ItemContent>
				</List.List>
				<Content.ContentBlockTitle>
					Dropdown With Input Expand
				</Content.ContentBlockTitle>
				<List.List>
					<List.ItemContent>
						<List.ItemInner>
							<List.ItemTitle label>Fruit</List.ItemTitle>
							<List.ItemInput>
								<input
									type="text"
									placeholder="Fruit"
									id="autocomplete-dropdown-expand"/>
							</List.ItemInput>
						</List.ItemInner>
					</List.ItemContent>
				</List.List>
				<Content.ContentBlockTitle>
					Dropdown With All Values
				</Content.ContentBlockTitle>
				<List.List>
					<List.ItemContent>
						<List.ItemInner>
							<List.ItemTitle label>Fruit</List.ItemTitle>
							<List.ItemInput>
								<input
									type="text"
									placeholder="Fruit"
									id="autocomplete-dropdown-all"/>
							</List.ItemInput>
						</List.ItemInner>
					</List.ItemContent>
				</List.List>
				<Content.ContentBlockTitle>
					Dropdown With Placeholder
				</Content.ContentBlockTitle>
				<List.List>
					<List.ItemContent>
						<List.ItemInner>
							<List.ItemTitle label>Fruit</List.ItemTitle>
							<List.ItemInput>
								<input
									type="text"
									placeholder="Fruit"
									id="autocomplete-dropdown-placeholder"/>
							</List.ItemInput>
						</List.ItemInner>
					</List.ItemContent>
				</List.List>
				<Content.ContentBlockTitle>
					Dropdown With Ajax-Data
				</Content.ContentBlockTitle>
				<List.List>
					<List.ItemContent>
						<List.ItemInner>
							<List.ItemTitle label>Language</List.ItemTitle>
							<List.ItemInput>
								<input
									type="text"
									placeholder="Language"
									id="autocomplete-dropdown-ajax"/>
							</List.ItemInput>
						</List.ItemInner>
					</List.ItemContent>
				</List.List>
				<Content.ContentBlockTitle>
					Standalone Autocomplete
				</Content.ContentBlockTitle>
				<Content.ContentBlock>
					<p>
						Standalone autocomplete provides better mobile UX by opening it in a new page or popup. Good to use when you need to get strict values without allowing free-type values.
					</p>
				</Content.ContentBlock>
				<Content.ContentBlockTitle>
					Simple Standalone Autocomplete
				</Content.ContentBlockTitle>
				<div className="list-block">
					<ul>
						<li>
							<a
								href="#"
								id="autocomplete-standalone"
								className="item-link item-content autocomplete-opener">
								<input type="hidden"/>
								<div className="item-inner">
									<div className="item-title">
										Favorite Fruite
									</div>
									<div className="item-after">
									</div>
								</div>
							</a>
						</li>
					</ul>
				</div>
			</View.PageContent>
		);
	}
});
