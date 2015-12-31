var React = require('react');
var BackButton = require('./BackButton');

module.exports = React.createClass({
    componentDidMount: function() {
        app.sizeNavbars(this.refs.navbar.getDOMNode());
    },
    render: function() {
        return (
            <div className="navbar" ref="navbar">
                <div className="navbar-inner">
                    <BackButton goBack={this.props.goBack}>{this.props.backText}</BackButton>
                    {this.props.children}
                </div>
            </div>
        );
    }
});
