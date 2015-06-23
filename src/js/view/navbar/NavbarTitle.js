var React = require('react');

module.exports = React.createClass({
    render: function() {
        return (
          <div className="center sliding">{this.props.children}</div>
        );
    }
});
