var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <div
                className="item-text"
                style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
});
