var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render: function() {
    		var className = cn("page-content", {
    			"messages-content": this.props.message
    		});
         return (
             <div className={className}>
                {this.props.children}
             </div>
         );
    }
});
