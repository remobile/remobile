var React = require('react');
var BackButton = require('./BackButton');
var NavbarMixins = require('../../mixins').Navbar;

module.exports = React.createClass({
    mixins: [NavbarMixins],
    componentDidMount: function() {
        this.sizeNavbars(this.refs.navbar.getDOMNode());
    },
    render: function() {
        return (
            <div className="navbar" ref="navbar">
                <div className="navbar-inner">
                    <BackButton goBack={this.props.goBack}>Back</BackButton>
                    {this.props.children}
                </div>
            </div>
        );
    }
});
