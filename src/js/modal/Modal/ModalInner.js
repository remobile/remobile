var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <div className="modal-inner">
                {this.props.children}
            </div>
        );
    }
});
