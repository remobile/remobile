var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

function getImage(i) {
	return {backgroundImage: 'url(img/app/photo/'+i+'.jpg)'}
}

module.exports = React.createClass({
	componentDidMount: function() {
		var params = {
			pagination: ".swiper-pagination",
			effect: "fade"
		};
		this.props.slider = swiper(this.refs.swiper.getDOMNode(), params);			
  },
  componentWillUnmount: function() {
		this.props.slider.destroy();
	},
	render: function() {
		return (
			<View.Page title="Swiper Fade">
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
      </View.Page>
		);
	}
});
