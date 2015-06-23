var React = require('react');

module.exports = React.createClass({
    render: function() {
         return (
             <div className="item-media">
                {this.props.children}
             </div>
         );
    }
});
