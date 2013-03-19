/*
 * API calls to Infrared remote bridge iTach
 */

var net = require('net')
var x10_host = '10.0.1.10';  // ip address of the CM19A
var x10_port = 1099;         // what port does the CM19A run on?
var x10_debug = true;         // show debug messages

var X10 = {
  a1: true,
  b1: true,

  /**
   * sends a sequence of ir messages.  msg2 and msg3 are optional.  if more than
   * one message is sent, then there will be a 1.5s delay between the messages
   */
  send: function (msg1, msg2, msg3) {
    // connect to the host
    var client = net.connect({host: x10_host, port: x10_port}, function () {
      if (x10_debug) {
        console.log('connected to x10');
        console.log(msg1);
      }
      client.write(msg1 + "\n");
      if (x10_debug) {
        console.log('sent');
      }

      setTimeout(function () {
        if (x10_debug) {
          console.log('closing socket');
        }
        client.end();
      }, 500);
    });

    // close the connection.  if there are more messages to be sent, send them
    client.on('end', function (data) {
      if (x10_debug) {
        console.log('disconnected from x10');
      }

      if (!(msg2 === undefined)) {
        setTimeout(function () {
          X10.send(msg2, msg3);
        }, 750);
      }
    });
  },

  /**
   * sends a series of ir messages to the iTach devices with a 1.5s delay between each.
   * regardless of whether the messages were sent successfully, this return a json
   * message of {'status':'ok'}
   */
  ajaxSend: function (res, message) {
    this.send(message, message);

    var body = "{'status':'ok'}";
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', body.length);
    res.end(body);
  }
}

// below here you'll find the API calls supported by homie

exports.a1 = function (req, res) {
  if (X10.a1) {
    var command = 'rf a1 off';
    X10.a1 = false;
    X10.ajaxSend(res, command);
  } else {
    var command = 'rf a1 on';
    X10.a1 = true;
    X10.ajaxSend(res, command);
  }
};

exports.b1 = function (req, res) {
  if (X10.b1) {
    var command = 'rf b1 off';
    X10.b1 = false;
    X10.ajaxSend(res, command);
  } else {
    var command = 'rf b1 on';
    X10.b1 = true;
    X10.ajaxSend(res, command);
  }
};

exports.c1 = function (req, res) {
  if (X10.c1) {
    var command = 'rf c1 off';
    X10.c1 = false;
    X10.ajaxSend(res, command);
  } else {
    var command = 'rf c1 on';
    X10.c1 = true;
    X10.ajaxSend(res, command);
  }
};

exports.d1 = function (req, res) {
  if (X10.d1) {
    var command = 'rf d1 off';
    X10.d1 = false;
    X10.ajaxSend(res, command);
  } else {
    var command = 'rf d1 on';
    X10.d1 = true;
    X10.ajaxSend(res, command);
  }
};

