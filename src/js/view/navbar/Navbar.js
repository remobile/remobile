var React = require('react');
var BackButton = require('./BackButton');
var NavbarTitle = require('./NavbarTitle');

module.exports = React.createClass({
    render() {
        return (
            <div className="navbar-inner">
                <BackButton goBack={this.props.goBack}>
                    {this.props.backText}
                </BackButton>
                <NavbarTitle>
                    {this.props.title}
                </NavbarTitle>
                {this.props.children}
            </div>
        );
    }
});
