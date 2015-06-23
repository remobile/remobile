var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
		getDefaultProps: function() {
        return {
            color: false
        }
    },
    onTap: function(){
        var func = this.props.onTap;
        func && func(this);
        app.hideModal();
    },
    render: function() {
    		var obj = {
            'actions-modal-button': true
        };
        if (this.props.color) {
            obj['color-'+this.props.color] = true;
        }
        var className = cn(obj);
        return (
            <span className={className} onClick={this.onTap}>
                {this.props.children}
            </span>
        );
    }
});
