var React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <div className="list-group">
                <ul>
                    {this.props.children}
                </ul>
            </div>
        );
    }
});
