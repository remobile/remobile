var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <div className="messages-date">
                {this.props.children}
            </div>
        );
    }
});
