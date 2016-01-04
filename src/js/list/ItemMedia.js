var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <div className="item-media">
                {this.props.children}
            </div>
        );
    }
});
