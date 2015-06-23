var React = require('react');

module.exports = React.createClass({
    render: function() {
        return (
            <div className="modal-text">
                {this.props.children}
            </div>
        );
    }
});
