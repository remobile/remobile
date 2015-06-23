var React = require('react');

module.exports = React.createClass({
    onTap: function(){
        var func = this.props.onTap;
        func && func(this);
        app.hideModal();
    },
    render: function() {
        return (
            <span className="modal-button" onClick={this.onTap}>
                {this.props.children}
            </span>
        );
    }
});
