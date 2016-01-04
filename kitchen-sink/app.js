var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var classnames = require('classnames');
var UI =require('UI');
var views = require('./modules');
var welcome = require('./modules/home/welcome');

function getHead(i) {
    return 'img/app/head/'+i+'.jpg';
}

var App = React.createClass({
    mixins: [UI.Mixins.App(views)],
    componentWillMount() {
        // welcome.showWelcome();
        this.userHeadCss = $.createStyleSheet();
        [1,2,3,4,5,6,7,8,9].map((i)=>{$.upsertStyleSheet(app.userHeadCss, '.user_head_'+i, 'background-image:url('+getHead(i)+')')});
    },
    getInitialState() {
        return {
            currentView: 'main'
        };
    },
    showCover(coverChildren, coverParams) {
        this.setState({coverVisible:true, coverChildren:coverChildren, coverParams:coverParams});
    },
    hideCover() {
        this.setState({coverVisible:false});
    },
    render() {
        return (
            <ReactCSSTransitionGroup transitionName={this.state.viewTransition.name} transitionEnter={this.state.viewTransition.in} transitionLeave={this.state.viewTransition.out} component="div">
                {this.state.coverVisible&&<UI.View.Cover params={this.state.coverParams}>{this.state.coverChildren}</UI.View.Cover>}
                {this.getCurrentView()}
            </ReactCSSTransitionGroup>
        );
    }
});

React.render(<App />, document.getElementById('app'));
