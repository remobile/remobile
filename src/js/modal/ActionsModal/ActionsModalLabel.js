var React = require('react');

module.exports = React.createClass({
    render: function() {
        return (
            <span className="actions-modal-label">
                {this.props.children}
            </span>
        );
    }
});
