var React = require('react');

module.exports = React.createClass({
    render: function() {
        return (
            <div className="subnavbar sliding">
                {this.props.children}
            </div>
        );
    }
});
