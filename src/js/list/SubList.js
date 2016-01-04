var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <ul>
                {this.props.children}
            </ul>
        );
    }
});
