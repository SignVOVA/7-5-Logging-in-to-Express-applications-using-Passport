// First is passport, which is the main library
var passport = require('passport'),
	// We extracting Strategy element from that module
	LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
	function(username, password, done) {
		if (username === 'admin' && password === 'lynda') {
			// We return done, along with an object with a user information
			return done(null, {username: 'admin'});
		}
		// Otherwise we pass false
		return done(null, false);
	}
));

/*
 * There are two funcitons that needs to be defined
 * So that the user information can be stored in a session
 * There are serialised user and deserialised user. No need to call and of these functions directly
 */

passport.serializeUser(function(user, done) {
	done(null, user.username);
});

passport.deserializeUser(function(username, done) {
	done(null, {username: username});
});

// Now we have passport configured for our user we can export it out of this module
module.exports = passport;
