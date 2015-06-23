var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            active: false,
            round: false,
            big: false,
            fill: false,
            list: false,
            inline: false,
            color: false,
        }
    },
    render: function() {
        var obj = {
            'button': !this.props.list,
            'active': this.props.active,
            'button-round': this.props.round,
            'button-big': this.props.big,
            'button-fill': this.props.fill,
            'list-button item-link': this.props.list,
        };
        if (this.props.color) {
            obj['color-'+this.props.color] = true;
        }
        var className = cn(obj);
        var style = this.props.inline?{display:'inline-block', verticalAlign:'middle'}:{};
        return (
            <a href='#' className={className} style={style} onClick={this.props.onTap}>
                {this.props.children}
            </a>
        );
    }
});
