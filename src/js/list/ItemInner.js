var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <div
                className="item-inner"
                style={this.props.style}
                onClick={this.props.onTap}>
                {this.props.children}
            </div>
        );
    }
});
