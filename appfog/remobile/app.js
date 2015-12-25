var express = require('express');
var app = express();

app.use(express.static('www'));

app.listen(process.env.VCAP_APP_PORT || 3000);
