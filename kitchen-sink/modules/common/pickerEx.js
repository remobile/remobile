var React = require('react');
var UI = require('UI');

var View = UI.View;
var Picker = UI.Picker;
var Content = UI.Content;
var List = UI.List;
var ActionsModal = UI.Modal.ActionsModal;

var DevicePicker = React.createClass({
	onChange: function(value) {
		console.log(value);
	},
	render: function() {
		var cols = [
            {
                textAlign: 'center',
                values: ['iPhone 4xx', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3']
            }
        ];
     var params = {cols: cols, defaultValue:[5],onChange:this.onChange};
     return (
			<Picker.PickerEx params={params}/>
		);
	}
});

var devicePickerModal = (
    <ActionsModal>
    	<DevicePicker />
		</ActionsModal>
);

function showDevicePicker() {
	app.showModal('pickerModal', devicePickerModal);	
}



var DescribePicker = React.createClass({
	onChange: function(value) {
		console.log(value);
	},
	render: function() {
		var cols = [
            {
                textAlign: 'left',
                values: ('Super Lex Amazing Bat Iron Rocket Lex Cool Beautiful Wonderful Raining Happy Amazing Funny Cool Hot').split(' ')
            },
            {
                values: ('Man Luthor Woman Boy Girl Person Cutie Babe Raccoon').split(' ')
            },
        ];
     var params = {
     	cols: cols, 
     	onChange:this.onChange
     };
	   return (
			<Picker.PickerEx params={params}/>
		);
	}
});

var describePickerModal = (
    <ActionsModal>
    	<DescribePicker />
		</ActionsModal>
);

function showDescribePicker() {
	app.showModal('pickerModal', describePickerModal);	
}


var carVendors = {
        Japanese : ['Honda', 'Lexus', 'Mazda', 'Nissan', 'Toyota'],
        German : ['Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Volvo'],
        American : ['Cadillac', 'Chrysler', 'Dodge', 'Ford']
    };

    
var countries = ['Japanese', 'German', 'American'];
var DependentPickerModal = React.createClass({
	onChange: function(value) {
		console.log(value);
	},
	render: function() {
		var cols = [{
                textAlign: 'left',
                values: countries,
                onChange: function (picker, index) {
                		var country = countries[index];
                    if(picker.cols[1].replaceValues){
                        picker.cols[1].replaceValues((function(n){var arr=[];for(var i=0;i<n;i++){arr[i]=i}return arr})(carVendors[country].length), carVendors[country]);
                    }
                }
            },
            {
                values: carVendors.Japanese,
                width: 160,
            }];
     var params = {
     	cols: cols, 
     	onChange:this.onChange,
     };
     return (
			<Picker.PickerEx params={params}/>
		);
	}
});

var dependentPickerModal = (
    <ActionsModal>
    	<DependentPickerModal />
		</ActionsModal>
);

function showDependentPicker() {
	app.showModal('pickerModal', dependentPickerModal);	
}
 

var CustomPicker = React.createClass({
	onChange: function(value) {
		console.log(value);
	},
	render: function() {
		var cols = [
            {
                values: ['Mr', 'Ms'],
            },
            {
                textAlign: 'left',
                values: ('Super Lex Amazing Bat Iron Rocket Lex Cool Beautiful Wonderful Raining Happy Amazing Funny Cool Hot').split(' ')
            },
            {
                values: ('Man Luthor Woman Boy Girl Person Cutie Babe Raccoon').split(' ')
            },
        ];
     var params = {
     		toolbarTemplate: 
            '<div class="toolbar">' +
                '<div class="toolbar-inner">' +
                    '<div class="left">' +
                        '<a href="#" class="link toolbar-randomize-link" onclick="app.hideModal()">Randomize</a>' +
                    '</div>' +
                    '<div class="right">' +
                        '<a href="#" class="link close-picker" onclick="app.hideModal()">That\'s me</a>' +
                    '</div>' +
                '</div>' +
            '</div>',
         cols: cols	
     };
     
     return (
			<Picker.PickerEx params={params}/>
		);
	}
});

var customPickerModal = (
    <ActionsModal>
    	<CustomPicker />
		</ActionsModal>
);

function showCustomPicker() {
	app.showModal('pickerModal', customPickerModal);	
}


var DateTimePicker = React.createClass({
	onChange: function(value) {
		console.log(value);
	},
	render: function() {
		var cols = [
            // Months
            {
                values: ('January February March April May June July August September October November December').split(' '),
                textAlign: 'left'
            },
            // Days
            {
                values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
            },
            // Years
            {
                values: (function () {
                    var arr = [];
                    for (var i = 1950; i <= 2030; i++) { arr.push(i); }
                    return arr;
                })(),
            },
            // Space divider
            {
                divider: true,
                content: ' '
            },
            // Hours
            {
                values: (function () {
                    var arr = [];
                    for (var i = 0; i <= 23; i++) { arr.push(i); }
                    return arr;
                })(),
            },
            // Divider
            {
                divider: true,
                content: ':'
            },
            // Minutes
            {
                values: (function () {
                    var arr = [];
                    for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                    return arr;
                })(),
            }
        ];
     var params = {
     cols:cols,
     defaultValue:[4,5,20,1,2],
     onChange:this.onChange,
     toolbar:false,
     inline: true
     };
   	 return (
			<Picker.PickerEx params={params} />
		);
	}
});


module.exports = React.createClass({
	render: function() {
		return (
			<View.Page title="Picker 2">
				<View.PageContent>
					<Content.ContentBlock>
		        <p>Picker is a powerful component that allows you to create custom overlay pickers which looks like iOS native picker.</p>
		        <p>Picker could be used as inline component or as overlay. Overlay Picker will be automatically converted to Popover on tablets (iPad).</p>
		      </Content.ContentBlock>
		      
					<Content.ContentBlockTitle>Picker with single value</Content.ContentBlockTitle>
					<List.List>
						<List.ItemContent>
							<List.ItemInner>
								<List.ItemInput><input type="text" placeholder="Your iOS device" readonly="readonly" onClick={showDevicePicker}/></List.ItemInput>
							</List.ItemInner>
						</List.ItemContent>
					</List.List>
					
					<Content.ContentBlockTitle>2 values and 3d-rotate effect</Content.ContentBlockTitle>
					<List.List>
						<List.ItemContent>
							<List.ItemInner>
								<List.ItemInput><input type="text" placeholder="Describe yourself" readonly="readonly" onClick={showDescribePicker}/></List.ItemInput>
							</List.ItemInner>
						</List.ItemContent>
					</List.List>
					
					<Content.ContentBlockTitle>Dependent values</Content.ContentBlockTitle>
					<List.List>
						<List.ItemContent>
							<List.ItemInner>
								<List.ItemInput><input type="text" placeholder="Your car" readonly="readonly" onClick={showDependentPicker}/></List.ItemInput>
							</List.ItemInner>
						</List.ItemContent>
					</List.List>
					
					<Content.ContentBlockTitle>Custom toolbar</Content.ContentBlockTitle>
					<List.List>
						<List.ItemContent>
							<List.ItemInner>
								<List.ItemInput><input type="text" placeholder="Describe yourself" readonly="readonly" onClick={showCustomPicker}/></List.ItemInput>
							</List.ItemInner>
						</List.ItemContent>
					</List.List>
					
					<Content.ContentBlockTitle>Inline Picker / Date-time</Content.ContentBlockTitle>
					<List.List>
						<List.ItemContent>
							<List.ItemInner>
									<DateTimePicker />
							</List.ItemInner>
						</List.ItemContent>
					</List.List>
					
				</View.PageContent>
       </View.Page>
		);
	}
});
