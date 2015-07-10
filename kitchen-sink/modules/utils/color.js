module.exports = (function() {
    "use strict";
    function Color() {
    }

    Color.prototype.usernameColor = function(online) {
        return online?{color:"#00FF7F"}:{color:"gray"};
    };

    return new Color();
})();


