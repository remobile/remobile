var React = require('react');
var CardContentInner = require('./CardContentInner');

module.exports = React.createClass({
    render() {
        if (this.props.inner) {
            return (
                <div
                    className="card-content"
                    style={this.props.style}>

                    <CardContentInner>
                        {this.props.children}
                    </CardContentInner>
                </div>
            );
        } else {
            return (
                <div
                    className="card-content"
                    style={this.props.style}>
                    {this.props.children}
                </div>
            );
        }
    }
});
