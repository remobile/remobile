var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <div className="item-subtitle">
                {this.props.children}
            </div>
        );
    }
});
