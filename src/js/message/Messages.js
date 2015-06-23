var React = require('react');

module.exports = React.createClass({
    render: function() {
         return (
    				<div className="messages">
    					{this.props.children}
    				</div>
         );
    }
});
