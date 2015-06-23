var React = require('react');

module.exports = React.createClass({
    render: function() {
        return (
            <div className="modal-title">
                {this.props.children}
            </div>
        );
    }
});
