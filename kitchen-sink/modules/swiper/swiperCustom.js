var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

function getImage(i) {
	return {backgroundImage: 'url(img/'+i+'.jpg)'}
}

module.exports = React.createClass({
	componentDidMount: function() {
		var params = {
			pagination: ".swiper-pagination",
			spaceBetween: 0,
			nextButton: ".swiper-button-next",
			prevButton: ".swiper-button-prev",
			paginationClickable: true
		};
		this.props.slider = swiper(this.refs.swiper.getDOMNode(), params);
  },
  componentWillUnmount: function() {
		this.props.slider.destroy();
	},
	render: function() {
		return (
			<View.Page  title="Button">
         <View.PageContent>
         		<div className="ks-slider-custom">
             <div className="swiper-container" ref="swiper">
			        <div className="swiper-pagination"></div>
		          <div className="swiper-wrapper">
		            <div style={getImage(1)} className="swiper-slide"></div>
			          <div style={getImage(2)} className="swiper-slide"></div>
			          <div style={getImage(3)} className="swiper-slide"></div>
			          <div style={getImage(4)} className="swiper-slide"></div>
			          <div style={getImage(5)} className="swiper-slide"></div>
			          <div style={getImage(6)} className="swiper-slide"></div>
			          <div style={getImage(7)} className="swiper-slide"></div>
			          <div style={getImage(8)} className="swiper-slide"></div>
			          <div style={getImage(9)} className="swiper-slide"></div>
		          </div>
		          <div className="swiper-button-prev"></div>
		          <div className="swiper-button-next"></div>
			      </div>
			     </div>
          </View.PageContent>
      </View.Page>
		);
	}
});