var React = require('react');
var cn = require('classnames');
var PickerItem = require('./PickerItem');

module.exports = React.createClass({
    render: function() {
    		var obj = {
    			"picker-items-col":true,
    			
    		};
    		if (this.props.textAlign) {
    			obj['picker-items-col-' + this.props.textAlign] = this.props.textAlign;
    		}
    		var className = cn(obj);
    		var values = this.props.values;
         return (
            <div className={className}>
            	<div className="picker-items-col-wrapper">
	            	{values.map((value, i) => {
	            		return <PickerItem index={i}>{value}</PickerItem>
	            	})}
            	</div>
            </div>
         );
    }
});
