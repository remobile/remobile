var React = require('react');

module.exports = React.createClass({
    render: function() {
         return (
             <span className="badge">{this.props.children}</span>
         )
    }
});
