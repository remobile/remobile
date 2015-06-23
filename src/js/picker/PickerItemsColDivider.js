var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render: function() {
    		var obj = {
    			"picker-items-col picker-items-col-divider":true,
    			
    		};
    		if (this.props.textAlign) {
    			obj['picker-items-col-' + this.props.textAlign] = this.props.textAlign;
    		}
    		var className = cn(obj);
         return (
            <div className={className}>
            	{this.props.children}
            </div>
         );
    }
});
