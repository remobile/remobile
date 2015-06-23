var React = require('react');

module.exports = React.createClass({
    render: function() {
         return (
            <div className="toolbar">
            	<div className="toolbar-inner">
            		{this.props.children}
            	</div>
            </div>
         );
    }
});
