var appPort = 3000;

var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	jade = require('jade');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false })

app.configure(function() {
	app.use(express.static(__dirname + '/public'));
});

// Render and send the main page

app.get('/', function(req, res){
  res.render('home.jade');
});

server.listen(appPort);

//look for the local ip address
var net = require('net');
function getNetworkIP(callback) {
  var socket = net.createConnection(80, 'www.google.com');
  socket.on('connect', function() {
    callback(undefined, socket.address().address);
    socket.end();
  });
  socket.on('error', function(e) {
    callback(e, 'error');
  });
}

getNetworkIP(function (error, ip) {
    console.log('Local Network Address is ' + ip);
    if (error) {
        console.log('error:', error);
    }
});

console.log('Server running at http://127.0.0.1:' + appPort +'/'); //started

var users = 0; //count the users

io.sockets.on('connection', function (socket) { // First connection
    users += 1; // Add 1 to the count
	reloadUsers(); // Send the count to all the users


    socket.on('setPseudo', function (data) { // Assign a name to the user
	    socket.set('pseudo', data, function(){
	    	console.log('User '+ data +' connected.');
	    });
	    var psuedo = data;
	});

	socket.on('message', function (message) { // Broadcast the message to all
		if(pseudoSet(socket))
		{
		    var data = { message : message, name : returnPseudo(socket) };
		    socket.broadcast.emit('message', data);
		    console.log("User " + data['name'] + " said \""+message+"\"");
		};
	});


	socket.on('disconnect', function () { //disconnection of the client
		users -= 1;
		reloadUsers();
	});

});

function reloadUsers() { // Send the count of the users to all
	io.sockets.emit('nbUsers', {"nb": users});
	console.log(users + ' users connected!');
}

function pseudoSet(socket) { // Test if the user has a name
	var test;
	socket.get('pseudo', function(err, name) {
		if (name == null ) test = false;
		else test = true;
	});
	return true;
}
function returnPseudo(socket) { // Return the name of the user
	var pseudo;
	socket.get('pseudo', function(err, name) {
		if (name == null ) pseudo = false;
		else pseudo = name;
	});
	return pseudo;
}