var React = require('react');

module.exports = React.createClass({
    render: function() {
        return (
            <div className="actions-modal-group">
                {this.props.children}
            </div>
        );
    }
});
