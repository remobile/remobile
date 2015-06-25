var React = require('react');

module.exports = React.createClass({
    render: function() {
         return (
             <div className="card-content-inner" style={this.props.style}>
                {this.props.children}
             </div>
         );
    }
});
