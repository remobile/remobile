var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var List = UI.List;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;
var ProgressBar = UI.Form.ProgressBar;
var Modal = UI.Modal;

var ProgressModal = React.createClass({
	getInitialState() {
		return {
			value:0,
		}
	},
	updateValue() {
		var value = this.state.value;
		if (value<100) {
			value++;
			this.setState({value:value});
			setTimeout(this.updateValue, 100);
		} else {
			app.closeModal();
		}
	},
	componentDidMount() {
		setTimeout(this.updateValue, 100);
	},
	render() {
		return (
			<div>
          <Modal.ModalInner>
          		<Modal.ModalTitle>下载进度</Modal.ModalTitle>
          		<p>
              	<ProgressBar color="blue" value={this.state.value}/>
              </p>
          </Modal.ModalInner>
        </div>
     )
	}
});

function showProgressModal() {
    app.showCover(<ProgressModal />, {type:'modal'});
 }

 module.exports.navbar = React.createClass({
     render() {
         return (
             <View.Navbar title="Progress Bar" />
         )
     }
 });

module.exports.page = React.createClass({
	getInitialState() {
		return {
			buttonIndex:0,
			progrees1: 10,
		}
	},
	buttonClick(index, value) {
		this.setState({buttonIndex:index, progrees1:value})
	},
	render() {
		var index = this.state.buttonIndex;
		return (
		<View.PageContent>
			<Content.ContentBlock>
				<p>When progress bar is determinate it indicates how long an operation will take when the percentage complete is detectable.</p>
			</Content.ContentBlock>

			<Content.ContentBlockTitle>Inline determinate progress bar</Content.ContentBlockTitle>
			<Content.ContentBlock>
				<Content.ContentBlockInner>
					<p>
						<ProgressBar color="blue" value={this.state.progrees1}/>
					</p>
					<ButtonsRow>
				      	<Button onTap={this.buttonClick.bind(null, 0, 10)} active={index===0}>10%</Button>
				      	<Button onTap={this.buttonClick.bind(null, 1, 30)} active={index===1}>30%</Button>
				      	<Button onTap={this.buttonClick.bind(null, 2, 50)} active={index===2}>50%</Button>
				  		<Button onTap={this.buttonClick.bind(null, 3, 100)} active={index===3}>100%</Button>
				  	</ButtonsRow>
				</Content.ContentBlockInner>
			</Content.ContentBlock>

			<Content.ContentBlockTitle>Inline determinate load & hide</Content.ContentBlockTitle>
			<Content.ContentBlock>
				<Content.ContentBlockInner>
			  		<Button onTap={showProgressModal}>Start Loading</Button>
				</Content.ContentBlockInner>
			</Content.ContentBlock>
		</View.PageContent>
		);
	}
});
