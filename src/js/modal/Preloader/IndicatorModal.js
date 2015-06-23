var React = require('react');
var PreloaderIndicatorModal = require('./PreloaderIndicatorModal');
var WhitePreloader = require('./WhitePreloader');

module.exports = React.createClass({
    render: function() {
         return (
             <PreloaderIndicatorModal>
                <WhitePreloader />
             </PreloaderIndicatorModal>
         );
    }
});
