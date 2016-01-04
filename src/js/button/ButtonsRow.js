var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <div className="buttons-row">
                {this.props.children}
            </div>
        );
    }
});
