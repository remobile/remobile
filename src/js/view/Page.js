var React = require('react');
var cn = require('classnames');
var NavbarTitle = require('./navbar/NavbarTitle');
var Navbar = require('./navbar/Navbar');
var BackButton = require('./navbar/BackButton');

module.exports = React.createClass({
    render: function() {
    		var navbar = false;
    		var title = false;
    		if (this.props.title) {
    			navbar = true;
    			title = this.props.title;
    		} else if (this.props.navbar) {
					navbar = true;
    		}
        var className = cn("page", {
            'navbar-through': navbar,
            'toolbar-through': this.props.toolbar
        });
        return (
             <div className={className} style={this.props.style}>
             		{!!title&&<Navbar><NavbarTitle>{title}</NavbarTitle>{this.props.right}</Navbar>}
                {this.props.children}
             </div>
         );
    }
});
