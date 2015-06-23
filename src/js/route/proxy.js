var http = require('http');
var bodyParser = require('body-parser');
var url=require('url');

var get_remote = function(url, callback) {
    var remote_req = http.get(url, function(remote_res) {
        callback(remote_res);
    });
    remote_req.end();
};
var post_remote = function(req, opt, callback) {
    var remoteurl = url.parse(opt.url);
    var data = opt.data;

    var contentType = 'application/x-www-form-urlencoded';
    if (typeof data == 'object') {
        contentType = 'application/json';
        data = JSON.stringify(data);
    }

    var options = {
        host: remoteurl.hostname,
        port: remoteurl.port,
        path: remoteurl.path,
        method: 'POST',
        headers:{
            'Content-Type':contentType,
        }
    };
    console.log(options);
    var remote_req = http.request(options, function(remote_res) {
        callback(remote_res);
    });
    remote_req.end(data);
};


function proxy(app) {
    return;
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(bodyParser.text());

    app.get('/hello', function (req, res) {
        res.send('hello');
    });

    app.post('/proxy', function (req, res) {
        var opt = req.body;
        console.log(opt);
        if (opt.type == 'POST') {
            post_remote(req, opt, function(response) {
                response.pipe(res);
            });
        } else {
            get_remote(opt.url, function(response) {
                response.pipe(res);
            });
        }
    });
}
module.exports = proxy;
