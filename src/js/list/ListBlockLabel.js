var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <li className="list-block-label">
                {this.props.children}
            </li>
        );
    }
});
