var React = require('react');
var UI = require('UI');
var Content = UI.Content;
var View = UI.View;

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Swiper Multiple" />
        )
    }
});

module.exports.page = React.createClass({
	componentDidMount() {
		var params1 = {
			pagination: ".swiper-pagination-c1",
			spaceBetween:50
		};
		this.props.slider1 = app.swiper(this.refs.swiper1.getDOMNode(), params1);

		var params2 = {
			pagination: ".swiper-pagination-c2",
			spaceBetween:20,
			slidesPerView: 2
		};
		this.props.slider2 = app.swiper(this.refs.swiper2.getDOMNode(), params2);

		var params3 = {
			pagination: ".swiper-pagination-c3",
			spaceBetween:10,
			slidesPerView: 3
		};
		this.props.slider3 = app.swiper(this.refs.swiper3.getDOMNode(), params3);

		var params4 = {
			pagination: ".swiper-pagination-c4",
			spaceBetween: 10,
			slidesPerView: "auto",
			centeredSlides: true
		};
		this.props.slider4 = app.swiper(this.refs.swiper4.getDOMNode(), params4);

		var params5 = {
			pagination: ".swiper-pagination-c5",
			spaceBetween: 10,
			direction: "vertical"
		};
		this.props.slider5 = app.swiper(this.refs.swiper5.getDOMNode(), params5);

		var params6 = {
			speed: 900,
			pagination: ".swiper-pagination-c6",
			spaceBetween: 50
		};
		this.props.slider6 = app.swiper(this.refs.swiper6.getDOMNode(), params6);
	},
	componentWillUnmount() {
		this.props.slider1.destroy();
		this.props.slider2.destroy();
		this.props.slider3.destroy();
		this.props.slider4.destroy();
		this.props.slider5.destroy();
		this.props.slider6.destroy();
	},
	render() {
		return (
         <View.PageContent>
         		 <Content.ContentBlockTitle>1 Slide Per View, 50px Between</Content.ContentBlockTitle>
	             <div className="swiper-container  ks-carousel-slider" style={style} ref="swiper1">
	             <div className="swiper-pagination swiper-pagination-c1"></div>
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

			     <Content.ContentBlockTitle>>2 Slides Per View, 20px Between</Content.ContentBlockTitle>
	             <div className="swiper-container  ks-carousel-slider" style={style}  ref="swiper2">
	             <div className="swiper-pagination swiper-pagination-c2"></div>
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

			     <Content.ContentBlockTitle>3 Slides Per View, 10px Between</Content.ContentBlockTitle>
	             <div className="swiper-container  ks-carousel-slider" style={style}  ref="swiper3">
	             <div className="swiper-pagination swiper-pagination-c3"></div>
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

			     <Content.ContentBlockTitle>Auto Slides Per View + Centered</Content.ContentBlockTitle>
	             <div className="swiper-container  ks-carousel-slider  ks-carousel-slider-auto" style={style}  ref="swiper4">
	             <div className="swiper-pagination swiper-pagination-c4"></div>
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

			     <Content.ContentBlockTitle>Vertical, 10px Between</Content.ContentBlockTitle>
	             <div className="swiper-container  ks-carousel-slider" style={style}  ref="swiper5">
	             <div className="swiper-pagination swiper-pagination-c5"></div>
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

			     <Content.ContentBlockTitle>Slow speed</Content.ContentBlockTitle>
	             <div className="swiper-container  ks-carousel-slider" style={style}  ref="swiper6">
	             <div className="swiper-pagination swiper-pagination-c6"></div>
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
		);
	}
});

var style={
	fontSize: '18px',
	height: '120px',
	margin: '0 0 35px'
};
