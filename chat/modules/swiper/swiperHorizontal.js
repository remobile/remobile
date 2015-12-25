var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

module.exports = React.createClass({
	componentDidMount: function() {
		var params = {
			pagination: ".swiper-pagination",
			paginationHide: true
		};
		this.props.slider = swiper(this.refs.swiper.getDOMNode(), params);			
  },
  componentWillUnmount: function() {
		this.props.slider.destroy();
	},
	render: function() {
		return (
			<View.Page  title="Swiper Horizontal">
         <View.PageContent>
             <div className="swiper-container ks-demo-slider" ref="swiper">
			        <div className="swiper-pagination"></div>
			        <div className="swiper-wrapper">
			          <div className="swiper-slide">Slide 1</div>
			          <div className="swiper-slide">Slide 2</div>
			          <div className="swiper-slide">Slide 3</div>
			          <div className="swiper-slide">Slide 4</div>
			          <div className="swiper-slide">Slide 5</div>
			          <div className="swiper-slide">Slide 6</div>
			          <div className="swiper-slide">Slide 7</div>
			          <div className="swiper-slide">Slide 8</div>
			          <div className="swiper-slide">Slide 9</div>
			          <div className="swiper-slide">Slide 10</div>
			        </div>
			      </div>
          </View.PageContent>
      </View.Page>
		);
	}
});
