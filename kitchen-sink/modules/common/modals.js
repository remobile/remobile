var React = require('react');
var UI = require('UI');
var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Grid = UI.Grid;
var Button = UI.Button.Button;
var Modal = UI.Modal;
function showAlertModal() {
	app.alert('Hello!');
}
var ReactAlertModal = React.createClass({
	render() {
		return (
			<div>
				<Modal.ModalInner>
					<Modal.ModalTitle>Hello</Modal.ModalTitle>
					<Modal.ModalText>Hello</Modal.ModalText>
				</Modal.ModalInner>
				<Modal.ModalButtons>
					<Modal.ModalButton>OK</Modal.ModalButton>
				</Modal.ModalButtons>
			</div>
     	)
	}
});
function showReactAlertModal() {
  app.showCover(<ReactAlertModal />, {type:'modal'});
}
function showConfirmModal() {
    app.confirm('Are you feel good today?', ()=>{
        app.alert('Great!');
    });
}
function showPromptModal() {
    app.prompt('What is your name?', (data)=>{
        // @data contains input value
        app.confirm('Are you sure that your name is ' + data + '?', ()=>{
            app.alert('Ok, your name is ' + data + ' ;)');
        });
    });
}
function showLoginModal() {
    app.modalLogin('Enter your username and password',  (username, password)=>{
        app.alert('Thank you! Username: ' + username + ', password: ' + password);
    });
}
function showPasswordModal() {
    app.modalPassword('Enter your password', (password)=> {
        app.alert('Thank you! Password: ' + password);
    });
}
function showActionsModal() {
    var actionSheetButtons = [
    // First buttons group
    [
        // Group Label
        {
            text: 'Here comes some optional description or warning for actions below',
            label: true
        },
        // First button
        {
            text: 'Alert',
            onClick() {
                app.alert('He Hoou!');
            }
        },
        // Another red button
        {
            text: 'Nice Red Button ',
            color: 'red',
            onClick() {
                app.alert('You have clicked red button!');
            }
        },
    ],
    // Second group
    [
        {
            text: 'Cancel',
            bold: true
        }
    ]
];
   app.actions(actionSheetButtons);
}
function openMultiAlerts() {
	 	app.alert('Alert 1');
    app.alert('Alert 2');
    app.alert('Alert 3');
    app.alert('Alert 4');
    app.alert('Alert 5');
}
function turnToPicker() {
	app.showView('picker');
}
function openPickerWithCustomHTML() {
	var html = '';
	html += '<div class="picker-modal">';
	html += '<div class="toolbar">';
	html += '<div class="toolbar-inner">';
	html += '<div class="left"></div>';
	html += '<div class="right"><a href="#" class="link" onClick="app.closeModal()">Done</a></div>';
	html += '</div>';
	html += '</div>';
	html += '<div class="picker-modal-inner">';
	html += '<div class="content-block">';
	html += '<p>Integer mollis nulla id nibh elementum finibus. Maecenas eget fermentum ipsum. Sed sagittis condimentum nisl at tempus. Duis lacus libero, laoreet vitae ligula a, aliquet eleifend sapien. Nullam sodales viverra sodales. Nulla hendrerit condimentum dolor facilisis tempor. Donec at est malesuada, sagittis nisi et, accumsan enim.</p>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	app.pickerModal(html);
}
var RectHTML = React.createClass({
	render() {
		return (
				<Content.ContentBlock>
					<p>Integer mollis nulla id nibh elementum finibus. Maecenas eget fermentum ipsum. Sed sagittis condimentum nisl at tempus. Duis lacus libero, laoreet vitae ligula a, aliquet eleifend sapien. Nullam sodales viverra sodales. Nulla hendrerit condimentum dolor facilisis tempor. Donec at est malesuada, sagittis nisi et, accumsan enim.</p>
				</Content.ContentBlock>
     )
	}
});
function openPickerWithRectHTML() {
	app.showCover(<RectHTML />, {type:'picker'});
}
var PopupView = React.createClass({
	render() {
		return (
			<Content.ContentBlock>
				<p>Long text block goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sem urna, gravida non scelerisque id, fringilla ac velit. Phasellus elementum a ipsum at ornare. Mauris sagittis rhoncus euismod. Integer convallis augue eu lacus ultrices, in dictum elit consequat. Nulla faucibus massa id felis egestas eleifend. Proin consequat dignissim magna ut scelerisque. Vestibulum ac lorem semper, posuere sapien nec, pharetra massa. Nulla a tellus facilisis, sollicitudin quam porta, aliquam lorem. Fusce dignissim eros ac diam molestie, ut ultrices lorem tristique. Ut facilisis augue ac nisi egestas malesuada. Nunc posuere tortor quis eleifend mollis. Aliquam erat volutpat. Donec feugiat elit tellus, nec convallis orci elementum in. Sed urna mi, vestibulum id tempus id, pretium et ante. Pellentesque eget sollicitudin ligula. Phasellus pellentesque velit eu porta suscipit.</p>
				<p>Long text block goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sem urna, gravida non scelerisque id, fringilla ac velit. Phasellus elementum a ipsum at ornare. Mauris sagittis rhoncus euismod. Integer convallis augue eu lacus ultrices, in dictum elit consequat. Nulla faucibus massa id felis egestas eleifend. Proin consequat dignissim magna ut scelerisque. Vestibulum ac lorem semper, posuere sapien nec, pharetra massa. Nulla a tellus facilisis, sollicitudin quam porta, aliquam lorem. Fusce dignissim eros ac diam molestie, ut ultrices lorem tristique. Ut facilisis augue ac nisi egestas malesuada. Nunc posuere tortor quis eleifend mollis. Aliquam erat volutpat. Donec feugiat elit tellus, nec convallis orci elementum in. Sed urna mi, vestibulum id tempus id, pretium et ante. Pellentesque eget sollicitudin ligula. Phasellus pellentesque velit eu porta suscipit.</p>
				<p>Long text block goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sem urna, gravida non scelerisque id, fringilla ac velit. Phasellus elementum a ipsum at ornare. Mauris sagittis rhoncus euismod. Integer convallis augue eu lacus ultrices, in dictum elit consequat. Nulla faucibus massa id felis egestas eleifend. Proin consequat dignissim magna ut scelerisque. Vestibulum ac lorem semper, posuere sapien nec, pharetra massa. Nulla a tellus facilisis, sollicitudin quam porta, aliquam lorem. Fusce dignissim eros ac diam molestie, ut ultrices lorem tristique. Ut facilisis augue ac nisi egestas malesuada. Nunc posuere tortor quis eleifend mollis. Aliquam erat volutpat. Donec feugiat elit tellus, nec convallis orci elementum in. Sed urna mi, vestibulum id tempus id, pretium et ante. Pellentesque eget sollicitudin ligula. Phasellus pellentesque velit eu porta suscipit.</p>
				<p>Long text block goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sem urna, gravida non scelerisque id, fringilla ac velit. Phasellus elementum a ipsum at ornare. Mauris sagittis rhoncus euismod. Integer convallis augue eu lacus ultrices, in dictum elit consequat. Nulla faucibus massa id felis egestas eleifend. Proin consequat dignissim magna ut scelerisque. Vestibulum ac lorem semper, posuere sapien nec, pharetra massa. Nulla a tellus facilisis, sollicitudin quam porta, aliquam lorem. Fusce dignissim eros ac diam molestie, ut ultrices lorem tristique. Ut facilisis augue ac nisi egestas malesuada. Nunc posuere tortor quis eleifend mollis. Aliquam erat volutpat. Donec feugiat elit tellus, nec convallis orci elementum in. Sed urna mi, vestibulum id tempus id, pretium et ante. Pellentesque eget sollicitudin ligula. Phasellus pellentesque velit eu porta suscipit.</p>
			</Content.ContentBlock>
     	)
	}
});
function showPopupView() {
	app.showCover(<PopupView />, {type:'popup', title:'Popup Title'});
}

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Modals" />
        )
    }
});

module.exports.page = React.createClass({
	render() {
		return (
			<View.PageContent>
				<Content.ContentBlock>
					<Content.ContentBlockInner>
						<p>There are 1:1 replacements of native Alert, Prompt and Confirm modals. They support callbacks, have very easy api and can be combined with each other. Check these examples:</p>
						<Grid.Row>
							<Grid.Col p per={33}>
								<Button onTap={showAlertModal}>Alert</Button>
							</Grid.Col>
							<Grid.Col p per={33}>
								<Button onTap={showConfirmModal}>Confirm</Button>
							</Grid.Col>
							<Grid.Col p per={33}>
								<Button onTap={showPromptModal}>Prompt</Button>
							</Grid.Col>
						</Grid.Row>
						<Grid.Row>
							<Grid.Col p per={33}>
								<Button onTap={showReactAlertModal}>
									React Alert
								</Button>
							</Grid.Col>
							<Grid.Col p per={33}>
								<Button onTap={showLoginModal}>
									Login Modal
								</Button>
							</Grid.Col>
							<Grid.Col p per={33}>
								<Button onTap={showPasswordModal}>
									Password Modal
								</Button>
							</Grid.Col>
						</Grid.Row>
						<Grid.Row>
							<Grid.Col p per={50}>
								<Button onTap={showActionsModal}>
									Action Sheet
								</Button>
							</Grid.Col>
							<Grid.Col p per={50}>
								<Button onTap={showPopupView}>Popup</Button>
							</Grid.Col>
						</Grid.Row>
					</Content.ContentBlockInner>
				</Content.ContentBlock>
				<Content.ContentBlockTitle>
					Action Sheet To Popover
				</Content.ContentBlockTitle>
				<Content.ContentBlock>
					<Content.ContentBlockInner>
						<p>
							Action Sheet could be automatically converted to Popover (for tablets). This button will open Popover on tablets and Action Sheet on phones: <Button inline round onTap={showActionsModal}>Action/Popover</Button>
					</p>
				</Content.ContentBlockInner>
			</Content.ContentBlock>
			<Content.ContentBlockTitle>
				Picker Modal
			</Content.ContentBlockTitle>
			<Content.ContentBlock>
				<Content.ContentBlockInner>
					<p>
						Such overlay type is similar to <Button inline round onTap={turnToPicker}>Picker{'\''}s</Button>overlay, but also allows to create custom picker overlays
					</p>
					<p>
						<Button onTap={openPickerWithCustomHTML}>
							Picker Modal With Custom HTML
						</Button>
					</p>
					<p>
						<Button onTap={openPickerWithRectHTML}>
							Picker Modal With React HTML
						</Button>
					</p>
				</Content.ContentBlockInner>
			</Content.ContentBlock>
			<Content.ContentBlockTitle>
				Modals Stack
			</Content.ContentBlockTitle>
			<Content.ContentBlock>
				<Content.ContentBlockInner>
					<p>This feature doesn{'\''}t allow to open multiple modals at the same time, and will automatically open next modal when you close the current one. Such behavior is similar to browser native alerts: </p>
					<p>
						<Button onTap={openMultiAlerts}>
							Open Multiple Alerts
						</Button>
					</p>
				</Content.ContentBlockInner>
			</Content.ContentBlock>
		</View.PageContent>
		);
	}
});
