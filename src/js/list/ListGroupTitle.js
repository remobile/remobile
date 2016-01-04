var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <li
                className="list-group-title" {...this.props.data}>
                {this.props.children}
            </li>
        );
    }
});
