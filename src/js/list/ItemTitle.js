var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render: function() {
    		 var className = cn({
    		 		"item-title":true,
    		 		"label": this.props.label
    		 })
         return (
             <div className={className} style={this.props.style}>
                {this.props.children}
             </div>
         );
    }
});
