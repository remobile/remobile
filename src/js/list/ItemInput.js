var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <div className="item-input">
                {this.props.children}
            </div>
        );
    }
});
