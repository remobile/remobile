var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render() {
        var obj = {
            "center": true,
            "sliding": !app.params.material,
        };
        return (
            <div className={cn(obj)}>
                {this.props.children}
            </div>
        );
    }
});
