var React = require('react');

module.exports = React.createClass({
    render: function() {
         return (
             <div className="preloader-indicator-modal">{this.props.children}</div>
         );
    }
});
