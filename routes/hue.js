var hue = require("node-hue-api").hue;
var lightState = require("node-hue-api").lightState;

var hue_host = "10.0.1.11",
  hue_user = "4d35bf04c806885c619b724d6a86d548",
  hue_desc = "homie - home automation suite";

var api = new hue.HueApi(hue_host, hue_user);

var jsonOk = function (res) {
  var body = "{'status':'ok'}";
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', body.length);
  res.end(body);
}

/**
 * the ids of the lights that handle our sunrise and midnight calls
 */
var dayLights = [1, 3];

var group1 = [4, 5, 6]

var group1On = false

/*
 * GET home page.
 */

var displayResult = function (result) {
  console.log(JSON.stringify(result, null, 2));
};

/**
 * slowly brighten the lights for the specified ids over the time and interval provided
 *
 * @param ids the ids of the lights to turn on
 * @param increment what percentage to bright per interval
 * @param interval the interval between updating the brightness (in ms)
 * @param value the current value of brightness
 */
var brighten = function (ids, increment, interval, value) {
  if (value == undefined) {
    value = 0
  }

  if (value <= 200) {
    console.log("#brightness(" + value + ")");
    value = value + increment;

    var warmth = 500;
    var brightness = value;
    if (value > 100) {
      brightness = 100;
      warmth = 500 - (value - 100) * 2;

    }

    var state = lightState
      .create()
      .white(warmth, brightness)
      .on();

    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      console.log("- setLightState(" + id + ")");
      api.setLightState(id, state);
    }

    setTimeout(function () {
      brighten(ids, increment, interval, value);
    }, interval);
  }
}


exports.discover = function (req, res) {
  console.log('#discover');

  var displayBridges = function (bridge) {
    console.log("Hue Bridges Found: " + JSON.stringify(bridge));
  };

  hue.locateBridges().then(displayBridges).done();

  jsonOk(res);
};

exports.register = function (req, res) {
  console.log('#register');

  hue.registerUser(hue_host, hue_user, hue_desc)
    .then(displayResult)
    .fail(function (result) {
      console.log('registration failed => ' + JSON.stringify(result));
    })
    .done();

  jsonOk(res);
};

exports.lights = function (req, res) {
  console.log("#lights");
  api
    .lights()
    .then(displayResult)
    .done();

  jsonOk(res);
};

exports.alert = function (req, res) {
  console.log("#alert");

  var state = lightState
    .create()
    .alert()
    .on();

  api.setLightState(1, state);
  api.setLightState(3, state);

  jsonOk(res);
};

/**
 * slowly bring up the lights to mimic sunrise
 */
exports.sunrise = function (req, res) {
  console.log("#sunrise");
  brighten(dayLights, 2, 2000);
  jsonOk(res);
};

/**
 * turn off day lights
 */
exports.midnight = function (req, res) {
  console.log("#midnight");
  var state = lightState.create().off();

  for (var i = 0; i < dayLights.length; i++) {
    api.setLightState(dayLights[i], state);
  }

  jsonOk(res);
};

/**
 * bright the day lights to max lighting
 */
exports.noon = function (req, res) {
  console.log("#noon");
  var state = lightState
    .create()
    .white(400, 100)
    .on();

  for (var i = 0; i < dayLights.length; i++) {
    api.setLightState(dayLights[i], state);
  }

  jsonOk(res);
};

exports.lights_on = function (req, res) {
  console.log("#lights_on");
  var state = lightState.create().on();

  for (var i = 0; i < group1.length; i++) {
    api.setLightState(group1[i], state);
  }

  jsonOk(res);
};

exports.lights_off = function (req, res) {
  console.log("#lights_off");
  var state = lightState.create().off();

  for (var i = 0; i < group1.length; i++) {
    api.setLightState(group1[i], state);
  }

  jsonOk(res);
};

exports.toggle_lights = function (req, res) {
  console.log("#toggle_lights");

  var state;
  var state = lightState.create().off();
  if( group1On ) {
    group1On = false
    state = lightState.create().off();
  } else {
    group1On = true
    state = lightState.create().on();
  } 

  for (var i = 0; i < group1.length; i++) {
    api.setLightState(group1[i], state);
  }

  jsonOk(res);
};




