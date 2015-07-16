module.exports = (function() {
    "use strict";
    function Color() {
    }

    Color.prototype.usernameColor = function(user) {
        return (user.userid===app.loginMgr.userid)?{color:"blue"}:user.online?{color:"#00FF7F"}:{color:"gray"};
    };

    return new Color();
})();


