var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <div className="item-after">
                {this.props.children}
            </div>
        );
    }
});
