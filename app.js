
/**
 * Module dependencies.
 */

var express = require('express')
  , routes  = require('./routes')
  , user    = require('./routes/user')
  , ir      = require('./routes/ir')
  , x10     = require('./routes/x10')
  , hue     = require('./routes/hue')
  , http    = require('http')
  , path    = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/',        routes.index);
app.get('/users',   user.list);

app.get('/api/ir/projector/power', ir.projector_power);
app.get('/api/ir/itv/play_pause', ir.itv_play_pause);
app.get('/api/ir/itv/menu', ir.itv_menu);
app.get('/api/ir/itv/up', ir.itv_up);
app.get('/api/ir/itv/down', ir.itv_down);
app.get('/api/ir/itv/left', ir.itv_left);
app.get('/api/ir/itv/right', ir.itv_right);
app.get('/api/ir/itv/select', ir.itv_select);

app.get('/api/x10/a1',  x10.a1);

app.get('/api/hue/discover', hue.discover);
app.get('/api/hue/register', hue.register);
app.get('/api/hue/lights', hue.lights);
app.get('/api/hue/alert', hue.alert);
app.get('/api/hue/sunrise', hue.sunrise);
app.get('/api/hue/midnight', hue.midnight);
app.get('/api/hue/noon', hue.noon);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
