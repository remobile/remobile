var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <div className="messages">
                {this.props.children}

            </div>
        );
    }
});
