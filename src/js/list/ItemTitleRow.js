var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <div className="item-title-row">
                {this.props.children}
            </div>
        );
    }
});
