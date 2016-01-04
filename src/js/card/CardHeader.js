var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render() {
        var obj = {
            "card-header": true
        };
        this.props.class&&(obj[this.props.class]=true);
        var className = cn(obj);
        return (
            <div
                className={className}
                style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
});
