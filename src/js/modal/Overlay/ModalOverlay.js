var React = require('react');

module.exports = React.createClass({
    render: function() {
        return <div className="modal-overlay" onClick={this.props.onTap}></div>;
    }
});
