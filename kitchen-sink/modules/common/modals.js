var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Grid = UI.Grid;
var Button = UI.Button.Button;
var Modal = UI.Modal;
		
   function showAlertModal() {
        var alertModal = (
            <Modal.Modal>
                <Modal.ModalInner>
                    <Modal.ModalTitle>Hello</Modal.ModalTitle>
                    <Modal.ModalText>Hello</Modal.ModalText>
                </Modal.ModalInner>
                <Modal.ModalButtons>
                    <Modal.ModalButton>OK</Modal.ModalButton>
                </Modal.ModalButtons>
            </Modal.Modal>
        );
        
        app.showModal('modal', alertModal);
   }
   
    function showConfirmModal() {
        var confirmModal = (
            <Modal.Modal>
                <Modal.ModalInner>
                    <Modal.ModalTitle>Hello</Modal.ModalTitle>
                    <Modal.ModalText>Hello</Modal.ModalText>
                </Modal.ModalInner>
                <Modal.ModalButtons>
                    <Modal.ModalButton>Cancel</Modal.ModalButton>
                    <Modal.ModalButton onTap={alert}>OK</Modal.ModalButton>
                </Modal.ModalButtons>
            </Modal.Modal>
        );
        
        app.showModal('modal', confirmModal);
   }
   
   function showPromptModal() {
        var promptModal = (
            <Modal.Modal>
                <Modal.ModalInner>
                    <Modal.ModalTitle>Hello</Modal.ModalTitle>
                    <Modal.ModalText>What is yout name?</Modal.ModalText>
                    <Modal.ModalTextInput placeholder="input your name"/>
                </Modal.ModalInner>
                <Modal.ModalButtons>
                    <Modal.ModalButton>Cancel</Modal.ModalButton>
                    <Modal.ModalButton onTap={alert}>OK</Modal.ModalButton>
                </Modal.ModalButtons>
            </Modal.Modal>
        );
        app.showModal('modal', promptModal);
   }
   
   function showLoginModal() {
        var loginModal = (
            <Modal.Modal>
                <Modal.ModalInner>
                    <Modal.ModalTitle>Hello</Modal.ModalTitle>
                    <Modal.ModalText>Input your username and password</Modal.ModalText>
                    <Modal.ModalTextInputDouble placeholder="username"/>
                    <Modal.ModalTextInputDouble type="password" placeholder="password"/>
                </Modal.ModalInner>
                <Modal.ModalButtons>
                    <Modal.ModalButton>Cancel</Modal.ModalButton>
                    <Modal.ModalButton onTap={alert}>OK</Modal.ModalButton>
                </Modal.ModalButtons>
            </Modal.Modal>
        );
        app.showModal('modal', loginModal);
   }
   
   function showPasswordModal() {
        var loginModal = (
            <Modal.Modal>
                <Modal.ModalInner>
                    <Modal.ModalTitle>Hello</Modal.ModalTitle>
                    <Modal.ModalText>Enter your password</Modal.ModalText>
                    <Modal.ModalTextInput type="password" placeholder="password"/>
                </Modal.ModalInner>
                <Modal.ModalButtons>
                    <Modal.ModalButton>Cancel</Modal.ModalButton>
                    <Modal.ModalButton onTap={alert}>OK</Modal.ModalButton>
                </Modal.ModalButtons>
            </Modal.Modal>
        );
        app.showModal('modal', loginModal);
   }
   
   function showActionsModal() {
        var actionsModal = (
            <Modal.ActionsModal>
            <Modal.ActionsModalGroup>
                <Modal.ActionsModalLabel>
                    fang
                </Modal.ActionsModalLabel>
                <Modal.ActionsModalButton>
                    click1
                </Modal.ActionsModalButton>
                <Modal.ActionsModalButton>
                    click2
                </Modal.ActionsModalButton>
            </Modal.ActionsModalGroup>
            <Modal.ActionsModalGroup>
                <Modal.ActionsModalButton color="red" active >
                    cancel
                </Modal.ActionsModalButton>
            </Modal.ActionsModalGroup>
        </Modal.ActionsModal>
        );
        
        app.showModal('actionsModal', actionsModal);
   }
   
   
   function showPreLoaderModal() {
        var preLoaderModal = (
            <Modal.ModalNoButttons>
                <Modal.ModalInner>
                    <Modal.ModalTitle>Hello</Modal.ModalTitle>
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
	        <Content.ContentBlockInner>
		          <p>There are 1:1 replacements of native Alert, Prompt and Confirm modals. They support callbacks, have very easy api and can be combined with each other. Check these examples:</p>
		          <Grid.Row>
			          <Grid.Colp per={33}><Button onTap={showAlertModal}>Alert</Button></Grid.Colp>
			          <Grid.Colp per={33}><Button onTap={showConfirmModal}>Confirm</Button></Grid.Colp>
			          <Grid.Colp per={33}><Button onTap={showPromptModal}>Prompt</Button></Grid.Colp>
		          </Grid.Row>
		          <Grid.Row>
			          <Grid.Colp per={50}><Button onTap={showLoginModal}>Login Modal</Button></Grid.Colp>
			          <Grid.Colp per={50}><Button onTap={showPasswordModal}>Password Modal</Button></Grid.Colp>
		          </Grid.Row>
		          <Grid.Row>
			          <Grid.Colp per={50}><Button onTap={showActionsModal}>Action Sheet</Button></Grid.Colp>
			          <Grid.Colp per={50}><Button>Popup</Button></Grid.Colp>
		          </Grid.Row>
	      		</Content.ContentBlockInner>
	        </Content.ContentBlock>
	        
	        <Content.ContentBlockTitle>Action Sheet To Popover</Content.ContentBlockTitle>
		      <Content.ContentBlock>
		        <Content.ContentBlockInner>
		          <p>Action Sheet could be automatically converted to Popover (for tablets). This button will open Popover on tablets and Action Sheet on phones: <Button inline round onTap={showActionsModal}>Action/Popover</Button></p>
		        </Content.ContentBlockInner>
		      </Content.ContentBlock>
		      
		      <Content.ContentBlockTitle>Picker Modal</Content.ContentBlockTitle>
		      <Content.ContentBlock>
		        <Content.ContentBlockInner>
		          <p>Such overlay type is similar to <Button inline round>Picker's</Button>overlay, but also allows to create custom picker overlays</p>
		          <p><Button>Picker Modal With Custom HTML</Button></p>
		        </Content.ContentBlockInner>
		      </Content.ContentBlock>
		      <Content.ContentBlockTitle>Modals Stack</Content.ContentBlockTitle>
		      <Content.ContentBlock>
		        <Content.ContentBlockInner>
		          <p>This feature doesn't allow to open multiple modals at the same time, and will automatically open next modal when you close the current one. Such behavior is similar to browser native alerts: </p>
		          <p><Button>Open Multiple Alerts</Button></p>
		        </Content.ContentBlockInner>
		      </Content.ContentBlock>
	      
				</View.PageContent>
       </View.Page>
		);
	}
});
