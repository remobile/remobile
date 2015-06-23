var React = require('react');

module.exports = React.createClass({
    render: function() {
         return (
            <div className="picker-item" data-picker-value={this.props.index}>
            	{this.props.children}
            </div>
         );
    }
});
