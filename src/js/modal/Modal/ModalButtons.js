var React = require('react');

module.exports = React.createClass({
    render: function() {
        return (
            <div className="modal-buttons">
                {this.props.children}
            </div>
        );
    }
});
