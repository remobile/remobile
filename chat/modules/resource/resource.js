"use strict";
var aud = '../audio/';
//var aud_file_type = (navigator.app.target==="web")?"mp3":"wav";
var aud_file_type = "wav";
module.exports = {
    aud_fail_tip: aud+'fail_tip.'+aud_file_type,
    aud_login_tip: aud+'login_tip.'+aud_file_type,
    aud_message_tip: aud+'message_tip.'+aud_file_type,
    aud_new_message: aud+'new_message.'+aud_file_type,
    aud_call_in: aud+'call_in.'+aud_file_type,
    aud_call_out: aud+'call_out.'+aud_file_type,
    aud_hangup: aud+'hangup.'+aud_file_type,
    aud_refuse: aud+'hangup.'+aud_file_type,
    aud_call_error: aud+'hangup.'+aud_file_type,
    aud_busy: aud+'busy.'+aud_file_type
};

