var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render: function() {
    		var obj = {
		        "row": this.props.row
		    };
		    this.props.class&&(obj[this.props.class]=true);
				var className = cn("content-block", obj);
         return (
             <div className={className} style={this.props.style}>
                {this.props.children}
             </div>
         );
    }
});
