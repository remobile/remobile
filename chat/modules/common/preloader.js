var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var Button = UI.Button.Button;
var Modal = UI.Modal;
	
function showPreloader(text) {
	console.log(text);
		text = text||'Loading...';console.log(text);
    var preLoaderModal = (
        <Modal.ModalNoButttons>
            <Modal.ModalInner>
                <Modal.ModalTitle>{text}</Modal.ModalTitle>
                <Modal.ModalText>
                    <Modal.BlackPreloader />
                </Modal.ModalText>
            </Modal.ModalInner>
        </Modal.ModalNoButttons>
    );
   app.showModal('modal', preLoaderModal);
   setTimeout(function() {
        app.hideModal();
    }, 3000);
}

function showIndicator() {
	app.showModal('indicator');
	setTimeout(function() {
        app.hideModal();
    }, 3000);
}

module.exports = React.createClass({
	render: function() {
		return (
			<View.Page title="Modals">
				<View.PageContent>
				
					<Content.ContentBlock>
	        	<p>How about an activity indicator? Framework 7 has a nice one. The F7 preloader is made with SVG and animated with CSS so it can be easily resized. Two options are available: the default is for light background and another one is for dark background. The HTML is pretty easy, just add a .preloader className to any element. For the dark background option, also add a .preloader-white className. Here are some examples:</p>
	        </Content.ContentBlock>
	        
	        <Content.ContentBlock row style={{textAlign:'center'}}>
		          <div className="col-25">Default:<br /><span className="preloader"></span></div>
			        <div style={{backgroundColor: '#333'}} className="col-25">White:<br /><span className="preloader preloader-white"></span></div>
			        <div className="col-25">Big:<br /><span className="preloader" style={{width: '42px', height:'42px'}}></span></div>
			        <div style={{backgroundColor: '#333'}} className="col-25">White:<br /><span className="preloader preloader-white" style={{width: '42px', height:'42px'}}></span></div>
	        </Content.ContentBlock>
	        
		      <Content.ContentBlock>
			        <p>With <b>showIndicator()</b> you can call small overlay with indicator:</p>
			        <Button onTap={showIndicator}>Open small indicator overlay</Button>
			        <p>With <b>showPreloader()</b> you can call modal window with preloader:</p>
			        <Button onTap={showPreloader.bind(this, '')}>Open preloader modal</Button>
			        <p>With <b>showPreloader('My text...')</b> you can call it with custom title:</p>
			        <Button onTap={showPreloader.bind(this, 'My text...')}>Open custom preloade</Button>
		      </Content.ContentBlock>
	        
				</View.PageContent>
       </View.Page>
		);
	}
});
