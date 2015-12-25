var express = require('express');
 var path = require('path');

var app = express();
 var wwwPath = path.join(__dirname, "www");
app.use(express.static(wwwPath));
app.get('/', function (req, res) {
    res.sendFile(wwwPath+'index.html');
});
var server = app.listen(process.env.PORT || 8000, function() {
    console.log('Local Server ready on port %d', server.address().port);
});
