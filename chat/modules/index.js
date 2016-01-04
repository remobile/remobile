module.exports = {
	// app
	'home': require('./home/main'),
	//chat
	'login': require('./login/login'),
	'register': require('./login/register'),
	'selectHead': require('./login/selectHead'),
	'messageInfo': require('./message/messageInfo'),
	'sendMultiMessage': require('./message/sendMultiMessage'),
	'contactInfo': require('./contact/contactInfo'),
	'selectUsers': require('./contact/selectUsers'),
	'audioCall': require('./call/audioCall'),
	'videoCall': require('./call/videoCall'),
	'groupList': require('./group/groupList'),
	'createGroup': require('./group/createGroup'),
	'searchGroup': require('./group/searchGroup'),
	'groupDetail': require('./group/groupDetail'),
	'searchGroupList': require('./group/searchGroupList'),
	'selectGroupUser': require('./group/searchGroup'),
};
