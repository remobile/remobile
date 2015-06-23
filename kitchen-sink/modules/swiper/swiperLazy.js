var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

function getImage(i) {
	return 'img/'+i+'.jpg';
}

module.exports = React.createClass({
	componentDidMount: function() {
		var params = {
			pagination: ".swiper-pagination",
			nextButton: ".swiper-button-next",
			prevButton: ".swiper-button-prev",
			preloadImages: false,
			lazyLoading: true
		};
		this.props.slider = swiper(this.refs.swiper.getDOMNode(), params);			
  },
  componentWillUnmount: function() {
		this.props.slider.destroy();
	},
	render: function() {
		return (
			<View.Page  title="Swiper Lazy Loading">
         <View.PageContent>
			       <div className="swiper-container ks-lazy-slider" ref="swiper">
			        <div className="swiper-wrapper">
			          <div className="swiper-slide"><img data-src={getImage(1)} className="swiper-lazy"/>
			            <div className="preloader"></div>
			          </div>
			          <div className="swiper-slide"><img data-src={getImage(2)} className="swiper-lazy"/>
			            <div className="preloader"></div>
			          </div>
			          <div className="swiper-slide"><img data-src={getImage(3)} className="swiper-lazy"/>
			            <div className="preloader"></div>
			          </div>
			          <div className="swiper-slide"><img data-src={getImage(4)} className="swiper-lazy"/>
			            <div className="preloader"></div>
			          </div>
			          <div className="swiper-slide"><img data-src={getImage(5)} className="swiper-lazy"/>
			            <div className="preloader"></div>
			          </div>
			          <div className="swiper-slide"><img data-src={getImage(6)} className="swiper-lazy"/>
			            <div className="preloader"></div>
			          </div>
			          <div className="swiper-slide"><img data-src={getImage(7)} className="swiper-lazy"/>
			            <div className="preloader"></div>
			          </div>
			          <div className="swiper-slide"><img data-src={getImage(8)} className="swiper-lazy"/>
			            <div className="preloader"></div>
			          </div>
			          <div className="swiper-slide"><img data-src={getImage(9)} className="swiper-lazy"/>
			            <div className="preloader"></div>
			          </div>
			          <div className="swiper-slide"><img data-src={getImage(10)} className="swiper-lazy"/>
			            <div className="preloader"></div>
			          </div>
			        </div>
			        <div className="swiper-pagination swiper-pagination-white"></div>
			        <div className="swiper-button-prev swiper-button-white"></div>
			        <div className="swiper-button-next swiper-button-white"></div>
			      </div>
          </View.PageContent>
      </View.Page>
		);
	}
});
