var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    getDefaultProps() {
        return {
            noGutter: false,
        }
    },
    render() {
        var className = cn({
            'no-gutter': this.props.noGutter,
            'row':true
        });
        return (
            <div className={className}>
                {this.props.children}
            </div>
        );
    }
});
