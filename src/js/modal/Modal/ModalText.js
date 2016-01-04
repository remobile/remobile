var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <div className="modal-text">
                {this.props.children}
            </div>
        );
    }
});
