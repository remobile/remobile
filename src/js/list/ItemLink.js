var React = require('react');

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            link: false
        }
    },
    render: function() {
        return (
            <a href="#" className="item-link item-content" onClick={this.props.onTap}>
                {this.props.children}
            </a>
        );
    }
});
