var React = require('react');

module.exports = React.createClass({
    render: function() {
         return (
             <div className="modal modal-no-buttons">
                {this.props.children}
             </div>
         );
    }
});
