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
            newView:{id:'page1', params:{text:'Are you page 1'}, saved: {text:'I am developer'}}
        }
    },
    render() {
        var props = {};
        props.noAnimate = this.state.noAnimate;
        props.newView = views[this.state.newView.id];
        props.newView.params = this.state.newView.params;
        props.newView.saved = this.state.newView.saved;
        if (this.state.oldView) {
            props.oldView = views[this.state.oldView.id];
            if (props.oldView) {
                props.oldView.params = this.state.oldView.params;
                props.oldView.saved = this.state.oldView.saved;
            }
        }
        return (
            <View.View {...props} />
        );
    }
});

React.render(<App />, document.getElementById('app'));
