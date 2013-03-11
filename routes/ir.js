
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
	var power = 'sendir,1:1,5,37993,1,1,340,169,22,63,22,63,22,20,22,20,22,20,22,20,22,20,22,63,22,63,22,20,22,63,22,20,22,63,22,20,22,63,22,20,22,20,22,20,22,20,22,20,22,63,22,20,22,20,22,63,22,63,22,63,22,63,22,63,22,20,22,63,22,63,22,20,22,4863';
	IR.ajaxSend(res, power, power);
};

