module.exports = define(function(require) {
    var _self;

    function Register() {
        _self = this;
    }

    Register.prototype.register = function(args) {
        args = args.trim().split(/\s+/);
        if (args.length >= 3) {
            _self.username = args[0];
            _self.phone = args[1];
            _self.password = args[2];
            _self.doRegister();
        } else {
            _self.questionUserName();
        }
    };
    Register.prototype.questionUserName = function() {
        app.console.question("UserName: ", function(name) {
            name = name.trim();
            if (!name) {
                app.console.error("UserName is null");
                _self.questionUserName();
            } else {
                _self.username = name;
                _self.questionPhone();
            }
        });
    };
    Register.prototype.questionPhone = function() {
        app.console.question("Phone: ", function(phone) {
            phone = phone.trim();
            //if (/^1[\d]{10}/.test(phone)) {
            if (phone) {
                _self.phone = phone;
                _self.questionPassword();
            } else {
                app.console.error("phone is invalid");
                _self.questionPhone();
            }
        });
    };
    Register.prototype.questionPassword = function() {
        app.console.question("PassWord: ", function(pwd) {
            pwd = pwd.trim();
            if (!pwd) {
                app.console.error("PassWord is null");
                _self.questionPassword();
            } else {
                _self.password = pwd;
                _self.doRegister();
            }
        });
    };
    Register.prototype.doRegister = function() {
        var param = {
            username: _self.username,
            userid: _self.phone,
            password: _self.password,
            photo: '',
            mrp_id: '1',
            mrp_pwd: 'time'
        };
        app.socket.emit('USER_REGISTER_RQ', param);
    };
    Register.prototype.onRegister = function(obj) {
        if (!obj.error) {
            app.console.success("register success, you can login now!");
        } else {
            app.console.error(obj.error);
        }
    };
    return new Register();
});
