var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            block: false,
            inset: false,
            tabletInset: false,
            media: false,
            group: false
        }
    },
    render: function() {
        var obj = {
            'list-block': true,
            'inset': this.props.inset,
            'list-block-label': this.props.tabletInset,
            'media-list': this.props.media
        };
        if (this.props.class) {
        	obj[this.props.class] = true;
        }
        var className = cn(obj);

        var style= this.props.block?{}:{marginTop:'0px'};
        if (this.props.group) {
         return (
             <div className={className} style={style}>
                {this.props.children}
             </div>
         )
        } else {
         return (
             <div className={className} style={style}><ul>
                {this.props.children}
             </ul></div>
         )
        }
    }
});
