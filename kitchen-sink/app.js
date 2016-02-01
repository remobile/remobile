var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var {View, Mixins} =require('UI');
var views = require('./modules');
var welcome = require('./modules/home/welcome');
var LifeCycle = require('@remobile/react-lifecycle');

var App = React.createClass({
    mixins: [/*LifeCycle('app'),*/ Mixins.App(views)],

    getInitialState() {
        return {
            newView:{id:'main', params:{text:'Are you page 1'}, saved: {text:'I am developer'}}
        }
    },
    render() {
        return this.renderView();
    }
});

React.render(<App />, document.getElementById('app'));
