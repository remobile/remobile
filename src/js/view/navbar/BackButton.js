var React = require('react');

module.exports = React.createClass({
    goBack: function() {
        var goBack = this.props.goBack;
        if (!goBack || !goBack()) {
            app.goBack();
        }
    },
    render: function() {
    		var haveBackButton = this.props.goBack!==false;
        return (
            <div className="left sliding">
                {haveBackButton?<a href="#" className="link" onClick={this.goBack}><i className="icon icon-back"></i>
                    <span>{this.props.children}</span>
                </a>:<a href="#" className="link"></a>}
            </div>
        );
    }
});
