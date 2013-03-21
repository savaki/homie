
/*
 * API calls to Infrared remote bridge iTach
 */

var net      = require('net')
var ir_host  = '10.0.1.15';  // ip address of the iTach
var ir_port  = 4998;         // what port does the iTach run on?
var ir_debug = true;         // show debug messages

var IR = {
	/**
	 * sends a sequence of ir messages.  msg2 and msg3 are optional.  if more than
	 * one message is sent, then there will be a 1.5s delay between the messages
	 */
	send: function(msg1, msg2, msg3){
		// connect to the host
		var client = net.connect({host: ir_host, port: ir_port}, function() {
			if( ir_debug) {
				console.log('connected to ir_host');
				console.log('send message to => ' + msg1);
			}
			client.write(msg1 + '\r\n');
		});

		// once we receive data, request that the connection be closed
		client.on('data', function(data) {
			if( ir_debug ) {
				console.log('received => ' + data.toString());
			}
			client.end();
		});

		// close the connection.  if there are more messages to be sent, send them
		client.on('end', function(data) {
			if( ir_debug ) {
				console.log('disconnected from ir host');
			}

			if( !(msg2 === undefined) ) {
				setTimeout(function() {
					IR.send(msg2, msg3);	
				}, 1500);
			}
		});
	},

	/**
	 * sends a series of ir messages to the iTach devices with a 1.5s delay between each.
	 * regardless of whether the messages were sent successfully, this return a json
	 * message of {'status':'ok'}
	 */
	ajaxSend:function(res, msg1, msg2, msg3) {
		this.send(msg1, msg2, msg3);

		var body = "{'status':'ok'}";
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Content-Length', body.length);
		res.end(body);
	}
}

// below here you'll find the API calls supported by homie

exports.projector_power = function(req, res) {
	var command = 'sendir,1:1,5,37993,1,1,340,169,22,63,22,63,22,20,22,20,22,20,22,20,22,20,22,63,22,63,22,20,22,63,22,20,22,63,22,20,22,63,22,20,22,20,22,20,22,20,22,20,22,63,22,20,22,20,22,63,22,63,22,63,22,63,22,63,22,20,22,63,22,63,22,20,22,4863';
	IR.ajaxSend(res, command, command);
};

exports.itv_play_pause = function(req, res) {
	var command = 'sendir,1:3,7,38461,1,1,347,173,21,22,21,65,21,65,21,65,21,22,21,65,21,65,21,65,21,65,21,65,21,65,21,22,21,22,21,22,21,22,21,65,21,65,21,65,21,65,21,65,21,65,21,22,21,65,21,22,21,22,21,65,21,65,21,22,21,65,21,22,21,65,21,65,21,1306,347,173,21,22,21,65,21,65,21,65,21,22,21,65,21,65,21,65,21,65,21,65,21,65,21,22,21,22,21,22,21,22,21,65,21,65,21,22,21,65,21,22,21,22,21,22,21,22,21,22,21,22,21,65,21,65,21,22,21,65,21,22,21,65,21,65,21,4923';
	IR.ajaxSend(res, command);
};

exports.itv_menu = function(req, res) {
	var command = 'sendir,1:3,3,38461,1,1,347,172,21,22,21,64,21,64,21,64,21,22,21,64,21,64,21,64,21,64,21,64,21,64,21,22,21,22,21,22,21,22,21,64,21,64,21,64,21,22,21,22,21,22,21,22,21,22,21,22,21,22,21,64,21,64,21,22,21,64,21,22,21,64,21,65,21,1470,347,87,21,3695,347,87,21,4923';
	IR.ajaxSend(res, command);
};

exports.itv_left = function(req, res) {
	var command = 'sendir,1:3,1,38580,1,1,348,173,21,22,21,65,21,65,21,65,21,22,21,65,21,65,21,65,21,65,21,65,21,65,21,22,21,22,21,22,21,22,21,65,21,65,21,22,21,22,21,65,21,22,21,22,21,22,21,22,21,22,21,65,21,65,21,22,21,65,21,22,21,65,21,65,21,1473,347,87,21,4938';
	IR.ajaxSend(res, command);
};

exports.itv_right = function(req, res) {
	var command = 'sendir,1:3,1,38461,1,1,348,172,21,22,21,65,21,65,21,64,21,22,21,64,21,64,21,64,21,64,21,64,21,64,21,22,21,22,21,22,21,22,21,64,21,22,21,64,21,64,21,22,21,22,21,22,21,22,21,22,21,22,21,65,21,64,21,22,21,64,21,22,21,64,21,65,21,1470,347,87,21,4923';
	IR.ajaxSend(res, command);
};

exports.itv_up = function(req, res) {
	var command = 'sendir,1:3,4,38580,1,1,347,173,21,22,21,65,21,65,21,65,21,22,21,65,21,65,21,65,21,65,21,65,21,65,21,22,21,22,21,22,21,22,21,65,21,22,21,65,21,22,21,65,21,22,21,22,21,22,21,22,21,22,21,65,21,65,21,22,21,65,21,22,21,65,21,65,21,1474,347,87,21,4938';
	IR.ajaxSend(res, command);
};

exports.itv_down = function(req, res) {
	var command = 'sendir,1:3,2,38580,1,1,347,173,21,22,21,65,21,65,21,65,21,22,21,65,21,65,21,65,21,65,21,65,21,65,21,22,21,22,21,22,21,22,21,65,21,22,21,22,21,65,21,65,21,22,21,22,21,22,21,22,21,22,21,65,21,65,21,22,21,65,21,22,21,65,21,65,21,1475,347,87,21,4938';
	IR.ajaxSend(res, command);
};

exports.itv_select = function(req, res) {
	var command = 'sendir,1:3,5,38461,1,1,347,173,21,22,21,65,21,65,21,65,21,22,21,65,21,65,21,65,21,65,21,65,21,65,21,22,21,22,21,22,21,22,21,65,21,22,21,22,21,65,21,65,21,65,21,22,21,65,21,22,21,22,21,65,21,65,21,22,21,65,21,22,21,65,21,65,21,1393,347,173,21,22,21,65,21,65,21,65,21,22,21,65,21,65,21,65,21,65,21,65,21,65,21,22,21,22,21,22,21,22,21,65,21,65,21,22,21,65,21,22,21,22,21,22,21,22,21,22,21,22,21,65,21,65,21,22,21,65,21,22,21,65,21,65,21,4923';
	IR.ajaxSend(res, command);
};

exports.yamaha_louder = function(req, res) {
	var command = 'sendir,1:3,17,38226,1,1,343,172,22,21,22,64,22,21,22,64,22,64,22,64,22,64,22,21,22,64,22,21,22,64,22,21,22,21,22,21,22,21,22,64,22,21,22,64,22,21,22,64,22,64,22,21,22,21,22,21,22,64,22,21,22,64,22,21,22,21,22,64,22,64,22,64,22,1522,343,86,22,3669,343,86,22,3669,343,86,22,4892';
  IR.ajaxSend(res, command);
};

exports.yamaha_softer = function(req, res) {
	var command = 'sendir,1:3,24,38226,1,1,343,172,22,21,22,64,22,21,22,64,22,64,22,64,22,64,22,21,22,64,22,21,22,64,22,21,22,21,22,21,22,21,22,64,22,64,22,64,22,21,22,64,22,64,22,21,22,21,22,21,22,21,22,21,22,64,22,21,22,21,22,64,22,64,22,64,22,1522,343,86,22,4892';
	IR.ajaxSend(res, command);
};


