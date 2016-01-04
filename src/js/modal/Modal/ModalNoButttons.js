var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <div className="modal modal-no-buttons">
                {this.props.children}
            </div>
        );
    }
});
