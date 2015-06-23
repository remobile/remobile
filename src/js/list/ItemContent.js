var React = require('react');

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            link: false
        }
    },
    render: function() {
        if (this.props.link) {
         return (
             <li>
                 <a href="#" className="item-link item-content" onClick={this.props.onTap}>
                     {this.props.children}
                 </a>
             </li>
         );
       } else {
         return (
             <li>
                 <div className="item-content">
                    {this.props.children}
                 </div>
             </li>
         );
       }
    }
});
