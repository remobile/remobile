var React = require('react');

module.exports = React.createClass({
    getDefaultProps() {
        return {
            link: false
        }
    },
    render() {
        return (
            <a
                href="#"
                className="item-link item-content"
                onClick={this.props.onTap}>
                {this.props.children}
            </a>
        );
    }
});
