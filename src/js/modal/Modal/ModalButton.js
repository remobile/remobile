var React = require('react');

module.exports = React.createClass({
    onTap: function(){
        var func = this.props.onTap;
        func && func(this);
        app.closeModal();
    },
    render: function() {
        return (
            <span className="modal-button" style={this.props.style} onClick={this.onTap}>
                {this.props.children}
            </span>
        );
    }
});
