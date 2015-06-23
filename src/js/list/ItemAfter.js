var React = require('react');

module.exports = React.createClass({
    render: function() {
         return (
             <div className="item-after">
                {this.props.children}
             </div>
         );
    }
});
