var React = require('react');
var UI = require('UI');
var Content = UI.Content;
var View = UI.View;

function getImage(i) {
	return {backgroundImage: 'url(img/app/photo/'+i+'.jpg)'}
}

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Swiper Fade" />
        )
    }
});

module.exports.page = React.createClass({
	componentDidMount() {
		var params = {
			pagination: ".swiper-pagination",
			effect: "fade"
		};
		this.props.slider = app.swiper(this.refs.swiper.getDOMNode(), params);
	},
	componentWillUnmount() {
		this.props.slider.destroy();
	},
	render() {
		return (
         <View.PageContent>
             <div className="swiper-container ks-demo-slider ks-fade-slider" ref="swiper">
		        <div className="swiper-pagination"></div>
		        <div className="swiper-wrapper">
		          <div style={getImage(1)} className="swiper-slide"></div>
		          <div style={getImage(2)} className="swiper-slide"></div>
		          <div style={getImage(3)} className="swiper-slide"></div>
		          <div style={getImage(4)} className="swiper-slide"></div>
		        </div>
		      </div>
          </View.PageContent>
		);
	}
});
