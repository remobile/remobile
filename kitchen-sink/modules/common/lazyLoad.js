var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Card = UI.Card;
var List = UI.List;
var LazyImage = UI.Image.LazyImage;
var LazyBack = UI.Image.LazyBack;
var Badge = UI.Badge.Badge;
var Button = UI.Button.Button;

function getImages(i) {
    return 'img/app/photo/'+i+'.jpg';
}

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Lazy Load Image" />
        )
    }
});

module.exports.page = React.createClass({
	componentDidMount() {
		app.initImagesLazyLoad(this.getDOMNode());
	},
	componentWillUnmount() {
    app.destroyImagesLazyLoad(this.getDOMNode());
  },
	render() {
        return (
            <View.PageContent>
                <Content.ContentBlock>
                    <Content.ContentBlockInner>
	                    <p> <LazyImage src={getImages(1)} width="1500" height="1500" class="ks-demo-lazy"/></p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tempus viverra lectus sit amet lobortis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque faucibus consectetur mauris eget lobortis. Maecenas efficitur efficitur mauris ac vehicula. Sed ut lectus laoreet, semper nisi vel, maximus massa. Duis at lorem vitae sem auctor condimentum a at neque. Phasellus vel scelerisque dui. Morbi varius nibh eu finibus rutrum.</p>
                        <p> <LazyImage src={getImages(2)} width="1500" height="1500" class="ks-demo-lazy"/></p>
                        <p>Aenean id congue orci. Aliquam gravida nulla nec sollicitudin consectetur. Donec iaculis ipsum in purus tincidunt sagittis quis vehicula sapien. Vestibulum quis consectetur nibh. Pellentesque vehicula ligula sit amet commodo malesuada. Proin eget dolor sodales, egestas sapien sed, consectetur ante. Vivamus imperdiet porttitor condimentum. Aliquam sit amet tellus quis mauris dapibus convallis eu in nulla. Aliquam erat volutpat.</p>
                        <p> <LazyImage src={getImages(3)} width="1500" height="1500" class="ks-demo-lazy"/></p>
                        <p>Pellentesque aliquam maximus libero a tincidunt. Nunc rhoncus tellus ac congue commodo. Aenean malesuada ante sit amet erat efficitur vehicula ac id ipsum. Suspendisse sed purus vel nisl rhoncus feugiat et ut ante. Mauris vehicula ligula sed nisl vulputate, nec ullamcorper quam vehicula. Etiam eu turpis eget sem luctus rutrum at porta nulla. Ut posuere lorem et nisi faucibus molestie.</p>
                        <p> <LazyImage src={getImages(4)} width="1500" height="1500" class="ks-demo-lazy"/></p>
                        <p>Duis ullamcorper velit id enim rutrum, vel venenatis lacus laoreet. Sed id bibendum ligula, sed congue erat. Maecenas rhoncus posuere lorem ac consectetur. Duis accumsan, urna id pharetra tincidunt, libero nibh tincidunt enim, vestibulum suscipit turpis neque nec ante.</p>
                        <p> <LazyImage src={getImages(5)} width="1500" height="1500" class="ks-demo-lazy"/></p>
                        <p>Suspendisse potenti. Curabitur et neque ac ante dapibus mollis tempor eget ex. Vivamus porttitor faucibus dui. Nulla eleifend hendrerit cursus. Sed elit nulla, pulvinar vitae diam eget, consectetur efficitur orci. Vivamus vel pharetra sapien. Suspendisse tortor tortor, iaculis at ullamcorper sit amet, vestibulum vel arcu. Aenean sed eleifend sapien. Praesent at varius metus.</p>
                        <p> <LazyImage src={getImages(6)} width="1500" height="1500" class="ks-demo-lazy"/></p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent laoreet nisl eget neque blandit lobortis. Sed sagittis risus id vestibulum finibus. Cras vestibulum sem et massa hendrerit maximus. Vestibulum suscipit tristique iaculis. Nam vitae risus non eros auctor tincidunt quis vel nulla. Sed volutpat, libero ac blandit vehicula, est sem gravida lectus, sed imperdiet sapien risus ut neque.</p>
                        <p> <LazyImage src={getImages(7)} width="1500" height="1500" class="ks-demo-lazy"/></p>
                        <p>Aenean id congue orci. Aliquam gravida nulla nec sollicitudin consectetur. Donec iaculis ipsum in purus tincidunt sagittis quis vehicula sapien. Vestibulum quis consectetur nibh. Pellentesque vehicula ligula sit amet commodo malesuada. Proin eget dolor sodales, egestas sapien sed, consectetur ante. Vivamus imperdiet porttitor condimentum. Aliquam sit amet tellus quis mauris dapibus convallis eu in nulla. Aliquam erat volutpat.</p>
                        <p> <LazyImage src={getImages(8)} width="1500" height="1500" class="ks-demo-lazy"/></p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tempus viverra lectus sit amet lobortis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque faucibus consectetur mauris eget lobortis. Maecenas efficitur efficitur mauris ac vehicula. Sed ut lectus laoreet, semper nisi vel, maximus massa. Duis at lorem vitae sem auctor condimentum a at neque. Phasellus vel scelerisque dui. Morbi varius nibh eu finibus rutrum.</p>
                        <p> <LazyImage src={getImages(9)} width="1500" height="1500" class="ks-demo-lazy"/></p>
                        <p>Pellentesque aliquam maximus libero a tincidunt. Nunc rhoncus tellus ac congue commodo. Aenean malesuada ante sit amet erat efficitur vehicula ac id ipsum. Suspendisse sed purus vel nisl rhoncus feugiat et ut ante. Mauris vehicula ligula sed nisl vulputate, nec ullamcorper quam vehicula. Etiam eu turpis eget sem luctus rutrum at porta nulla. Ut posuere lorem et nisi faucibus molestie.</p>
                        <p> <LazyImage src={getImages(1)} width="1500" height="1500" class="ks-demo-lazy"/></p>
                        <p>Duis ullamcorper velit id enim rutrum, vel venenatis lacus laoreet. Sed id bibendum ligula, sed congue erat. Maecenas rhoncus posuere lorem ac consectetur. Duis accumsan, urna id pharetra tincidunt, libero nibh tincidunt enim, vestibulum suscipit turpis neque nec ante.</p>
                        <p><b>Using as background image:</b></p>
                        <LazyBack background={getImages(1)} class="ks-demo-lazy"></LazyBack>
                        <p>Suspendisse potenti. Curabitur et neque ac ante dapibus mollis tempor eget ex. Vivamus porttitor faucibus dui. Nulla eleifend hendrerit cursus. Sed elit nulla, pulvinar vitae diam eget, consectetur efficitur orci. Vivamus vel pharetra sapien. Suspendisse tortor tortor, iaculis at ullamcorper sit amet, vestibulum vel arcu. Aenean sed eleifend sapien. Praesent at varius metus.</p>
                		</Content.ContentBlockInner>
                </Content.ContentBlock>
            </View.PageContent>
        );
    }
});
