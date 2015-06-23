var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render: function() {
				var className = cn("content-block", {
		        "row": this.props.row
		    });
         return (
             <div className={className} style={this.props.style}>
                {this.props.children}
             </div>
         );
    }
});
