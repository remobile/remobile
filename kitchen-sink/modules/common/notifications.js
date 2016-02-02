var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Button = UI.Button.Button;

function notificationSimple() {
    app.addNotification({
        title: 'Framework7',
        message: 'This is a simple notification message with title and message'
    });
}
function notificationFull() {
    app.addNotification({
        title: 'Framework7',
        subtitle: 'Notification subtitle',
        message: 'This is a simple notification message with custom icon and subtitle',
        media: '<i class="icon icon-f7"></i>'
    });
}
function notificationCustom() {
    app.addNotification({
        title: 'My Awesome App',
        subtitle: 'New message from John Doe',
        message: 'Hello, how are you? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut posuere erat. Pellentesque id elementum urna, a aliquam ante. Donec vitae volutpat orci. Aliquam sed molestie risus, quis tincidunt dui.',
        media: '<img width="44" height="44" style="border-radius:100%" src="http://lorempixel.com/output/people-q-c-100-100-9.jpg">'
    });
}
function notificationCallback() {
    app.addNotification({
        title: 'My Awesome App',
        subtitle: 'New message from John Doe',
        message: 'Hello, how are you? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut posuere erat. Pellentesque id elementum urna, a aliquam ante. Donec vitae volutpat orci. Aliquam sed molestie risus, quis tincidunt dui.',
        media: '<img width="44" height="44" style="border-radius:100%" src="http://lorempixel.com/output/people-q-c-100-100-9.jpg">',
        onClose() {
            alert('Notification closed');
        }
    });
}

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Notifications" />
        )
    }
});

module.exports.page = React.createClass({
	render() {
		return (
    		<View.PageContent>
               <Content.ContentBlock>
               	<p>Framework7 comes with simple Notifications component that allows you to show some useful messages to user.</p>
    		        <p><Button onTap={notificationSimple}>Default notification</Button></p>
    		        <p><Button onTap={notificationFull}>Full-layout notification</Button></p>
    		        <p><Button onTap={notificationCustom}>With custom image</Button></p>
    		        <p><Button onTap={notificationCallback}>With callback on close</Button></p>
               </Content.ContentBlock>
    		</View.PageContent>
		);
	}
});
