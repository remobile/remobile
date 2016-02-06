var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var UI =require('UI');
var {View, Mixins} = UI;
var views = require('./modules');
var welcome = require('./modules/home/welcome');
var LifeCycle = require('@remobile/react-lifecycle');

function getHead(i) {
    return 'img/app/head/'+i+'.jpg';
}

var App = React.createClass({
    mixins: [/*LifeCycle('app')*/, Mixins.App(views)],
    componentWillMount() {
        //welcome.showWelcome();
        this.userHeadCss = $.createStyleSheet();
        [1,2,3,4,5,6,7,8,9].map((i)=>{$.upsertStyleSheet(app.userHeadCss, '.user_head_'+i, 'background-image:url('+getHead(i)+')')});
    },
    render() {
        return this.renderView('main', {}, 10);
    }
});

React.render(<App />, document.getElementById('app'));
