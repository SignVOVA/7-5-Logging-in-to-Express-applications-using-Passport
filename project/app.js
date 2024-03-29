
/**
 * Module dependencies.
 */

module.exports = function (flights, db) {
	var express = require('express');
	var MongoStore = require('connect-mongo')(express);
	// Lets define out passport module by using our custom authentication file we created. We use passport as midleware of our application
	var passport = require('./auth');
	var routes = require('./routes')(flights);
	var path = require('path');
	var app = express();

	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(express.session({
		secret: 'keyboard cat',
		store: new MongoStore({
			mongoose_connection: db
		})
	}));
	// Let use passport as a midleware of our application
	app.use(passport.initialize());
	// On this line we are telling passport to use a session in express. We telling passport to store a session.
	app.use(passport.session());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(function (req, res, next) {
		res.set('X-Powered-By', 'Flight Tracker');
		next();
	});
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

	app.get('/flight/:number', routes.flight);
	app.put('/flight/:number/arrived', routes.arrived);
	app.get('/list', routes.list);
	app.get('/arrivals', routes.arrivals);

	// create the login route link to our routes. Also we handle the post request to handle authentication
	app.get('/login', routes.login);
	// Authenticate takes 2 args. The 1st arg - is the strategy we want to use.
	// The 2nd arg is
	app.post('/login', passport.authenticate('local', {
		// If the login fails we want to redirect the user to the login page
		failureRedirect: '/login',
		// The second is the success redirect. In this case we want to redirect the user to the user page
		successRedirect: '/user'
	}));

	app.get('/user', routes.user);

	return app;
}
