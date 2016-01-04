var React = require('react');
var UI = require('UI');

var Content = UI.Content;
var View = UI.View;
var Grid = UI.Grid;
var Button = UI.Button.Button;

function getImage(i) {
    return {backgroundImage: 'url(img/app/head/'+i+'.jpg)', backgroundSize:"100% 100%"}
}

module.exports = React.createClass({
    componentDidMount: function() {
        var params = {
            pagination: ".swiper-pagination",
            effect: "coverflow",
            slidesPerView: "auto",
            centeredSlides: true
        };
        this.slider = app.swiper(this.refs.swiper.getDOMNode(), params);
        this.headImageIndex = 0;
        var self = this;
        this.slider.on('onProgress', function(el, per) {
            self.headImageIndex = Math.round(per*33);
        });
    },
    componentWillUnmount: function() {
        this.slider.destroy();
    },
    doSelectHead: function() {
        app.goBack(1, {headImageIndex: this.headImageIndex});
    },
    render: function() {
        var images = [];
        for (var i=0; i<33; i++) {
            images.push(<div key={i} style={getImage(i)} className="swiper-slide"></div>);
        }
        return (
            <View.Page  title="选择头像" right={<View.NavbarButton right onTap={this.doSelectHead}>Select</View.NavbarButton>}>
                <View.PageContent>
                    <div className="swiper-container ks-demo-slider ks-coverflow-slider" ref="swiper">
                        <div className="swiper-pagination"></div>
                        <div className="swiper-wrapper">
                            {images}
                        </div>
                    </div>
                </View.PageContent>
            </View.Page>
        );
    }
});
