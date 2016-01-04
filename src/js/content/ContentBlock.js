var React = require('react');
var assign = require('object-assign');
var cn = require('classnames');

module.exports = React.createClass({
    render() {
        var obj = {
            "row": this.props.row
        };
        this.props.class&&(obj[this.props.class]=true);
        var className = cn("content-block", obj);
        var style = assign({}, this.props.style, this.props.relative&&{position:"relative"});
        return (
            <div className={className} style={style}>
                {this.props.children}
            </div>
        );
    }
});
