var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <div className="modal-title">
                {this.props.children}
            </div>
        );
    }
});
