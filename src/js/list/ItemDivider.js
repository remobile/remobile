var React = require('react');

module.exports = React.createClass({
    render: function() {
         return (
             <li className="item-divider">
                {this.props.children}
             </li>
         );
    }
});
