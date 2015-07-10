var React = require('react');

module.exports = React.createClass({
    goBack: function() {
        app.goBack();
    },
    render: function() {
        return (
            <div className="left sliding">
                <a href="#" className="back link" onClick={this.goBack}><i className="icon icon-back"></i>
                    <span>{this.props.children}</span>
                </a>
            </div>
        );
    }
});
