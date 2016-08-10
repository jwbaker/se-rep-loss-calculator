// Borrowed from http://scotch.io.com/tutorials/how-to-deploy-a-node-js-app-to-heroku

var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.render('index');
});

app.listen(port, function(){
	console.log('Listening on http://localhost:' + port);
});