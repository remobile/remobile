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
			effect: "cube"
		};
		this.props.slider = swiper(this.refs.swiper.getDOMNode(), params);
  },
  componentWillUnmount: function() {
		this.props.slider.destroy();
	},
	render: function() {
		return (
			<View.Page  title="Swiper 3d Cube">
         <View.PageContent>
             <div className="swiper-container ks-demo-slider ks-cube-slider" ref="swiper">
			        <div className="swiper-wrapper">
			          <div style={getImage(1)} className="swiper-slide">Slide 1</div>
			          <div style={getImage(2)} className="swiper-slide">Slide 2</div>
			          <div style={getImage(3)} className="swiper-slide">Slide 3</div>
			          <div style={getImage(4)} className="swiper-slide">Slide 4</div>
			          <div style={getImage(5)} className="swiper-slide">Slide 5</div>
			          <div style={getImage(6)} className="swiper-slide">Slide 6</div>
			          <div style={getImage(7)} className="swiper-slide">Slide 7</div>
			          <div style={getImage(8)} className="swiper-slide">Slide 8</div>
			          <div style={getImage(9)} className="swiper-slide">Slide 9</div>
			        </div>
			      </div>
          </View.PageContent>
      </View.Page>
		);
	}
});
