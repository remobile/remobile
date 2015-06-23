var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var List = UI.List;
var Select = UI.Select;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;

var data = [
    {name:"fang1", value:1},
    {name:"fang2", value:2},
    {name:"fang3", value:3},
    {name:"fang4", value:4},
    {name:"fang5", value:5},
    {name:"fang6", value:6},
    {name:"fang7", value:7},
    {name:"fang8", value:8}
];

module.exports = React.createClass({
    onChange: function(arr) {
        arr.map((i)=>{
            console.log(data[i]);
        });
    },

	render: function() {
        var list = data.map((item)=>{return item.name});
		return (
			<View.Page title="CheckBox">
				<View.PageContent>
                    <Select.CheckboxSelect list={list} title="student" select={[1,2,3]} name="fang" onChange={this.onChange}/>
				</View.PageContent>
       </View.Page>
		);
	}
});
