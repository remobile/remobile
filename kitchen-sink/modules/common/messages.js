var React = require('react');
var UI = require('UI');

var View = UI.View;
var Message = UI.Message;
var MessageDate= Message.MessageDate;
var MessageText= Message.MessageText;


module.exports = React.createClass({
	render: function() {
		return (
			<View.Page title="Messages" toolbar>
				<View.PageContent message>
					<Message.Messages>
						<MessageDate>Sunday, Feb 9,<span>12:58</span></MessageDate>
						<MessageText sent>Hi, Kate</MessageText>
						<MessageText tail sent>How are you?</MessageText>
						<MessageText tail name="Kate Johnson" avatar="url(http://lorempixel.com/output/people-q-c-100-100-9.jpg)">Hi, i am good</MessageText>
						<MessageText tail name="Blue Ninja" avatar="url(http://lorempixel.com/output/people-q-c-100-100-7.jpg)">Hi there, I am also fine, thanks! And how are you?</MessageText>
		        <MessageText sent>Hey, Blue Ninja! Glad to see you ;)</MessageText>
		        <MessageText tail sent>What do you think about my new logo?</MessageText>
		        <MessageDate>Wednesday, Feb 12,<span>19:33</span></MessageDate>
		        <MessageText tail sent>Hey? Any thoughts about my new logo?</MessageText>
		        <MessageDate>Thursday, Feb 13,<span>11:20</span></MessageDate>
		        <MessageText sent>Alo...</MessageText>
		        <MessageText tail sent>Are you there?</MessageText>
		        <MessageText name="Blue Ninja" avatar="url(http://lorempixel.com/output/people-q-c-100-100-7.jpg)">Hi, i am here</MessageText>
						<MessageText tail avatar="url(http://lorempixel.com/output/people-q-c-100-100-7.jpg)">our logo is great</MessageText>
						<MessageText tail name="Kate Johnson" avatar="url(http://lorempixel.com/output/people-q-c-100-100-9.jpg)">Leave me alone!</MessageText>
		        <MessageText sent>:(</MessageText>
		        <MessageText sent>Hey, look, cutest kitten ever!</MessageText>
		        <MessageText tail sent pic="http://placekitten.com/g/300/400" />
		        <MessageText tail name="Blue Ninja" avatar="url(http://lorempixel.com/output/people-q-c-100-100-7.jpg)">Yep</MessageText>
		        <MessageText tail sent label="Delivered 1 week ago">Cool</MessageText>
		      </Message.Messages>
				</View.PageContent>
				<Message.MessageToolbar />
       </View.Page>
		);
	}
});
