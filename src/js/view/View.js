var React = require('react');

module.exports = React.createClass({
    render: function() {
         return (
             <div className="view">
                {this.props.children}
             </div>
         );
    }
});
