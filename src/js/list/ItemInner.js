var React = require('react');

module.exports = React.createClass({
    render: function() {
         return (
             <div className="item-inner" onClick={this.props.onTap}>
                {this.props.children}
             </div>
         );
    }
});
