var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render: function() {
        var divCN = cn({
            "right": this.props.right,
            "left": this.props.left
        });
        var aCN = cn("link", {
            "icon-only": this.props.iconOnly
        });
        if (this.props.icon) {
            var obj = {"icon": true};
            obj[this.props.icon] = true;
            var iCN = cn(obj);
            return (
                <div className={divCN}>
                    <a href="#" className={aCN} onClick={this.props.onTap}>
                        <i className={iCN}></i>
                        {this.props.children}
                    </a>
                </div>
            )
        } else {
            return (
                <div className={divCN}>
                    <a href="#" className={aCN} onClick={this.props.onTap}>
                        {this.props.children}
                    </a>
                </div>
            )
        }
    }
});
