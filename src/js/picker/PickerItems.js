var React = require('react');
var PickerItemsCol = require('./PickerItemsCol');
var PickerItemsColDivider = require('./PickerItemsColDivider');
var BlackPreloader = require('../modal/Preloader/BlackPreloader');
var PreloaderIndicatorModal = require('../modal/Preloader/PreloaderIndicatorModal');

module.exports = React.createClass({
    render: function() {
    		var cols = this.props.cols;
         return (
	            <div className="picker-modal-inner picker-items">
	            	{cols.map((col)=>{
	            		return col.divider?<PickerItemsColDivider textAlign={col.textAlign}>{col.content}</PickerItemsColDivider>:<PickerItemsCol values={col.values} textAlign={col.textAlign}/>
	            	})}
	            	<div className="picker-center-highlight"></div>
	            </div>
         );
    }
});
