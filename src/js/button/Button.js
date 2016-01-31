var React = require('react');
var cn = require('classnames');
var assign = require('object-assign');

module.exports = React.createClass({
    render() {
        var obj = {
            'button': !this.props.list&&!this.props.link,
            'active': this.props.active,
            'button-round': this.props.round,
            'button-big': this.props.big,
            'button-fill': this.props.fill,
            'list-button item-link': this.props.list,
            'tab-link': this.props.tab,
            'link': this.props.link,
        };
        if (this.props.color) {
            obj['color-'+this.props.color] = true;
        }
        var link = this.props.tab?this.props.tab:'#';
        var className = cn(obj);
        var style = this.props.inline?{display:'inline-block', verticalAlign:'middle'}:{};
        style = assign(style, this.props.style);
        return (
            <a
                href={link}
                className={className}
                style={style}
                onClick={this.props.onTap}>
                {this.props.children}
            </a>
        );
    }
});
