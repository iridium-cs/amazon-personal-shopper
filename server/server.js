// EXPRESS SERVER
const express = require('express');
const app = express();

// PASSPORT OAUTH
const passport = require('passport');
const AmazonStrategy = require('passport-amazon').Strategy;
// Obtained by registering with Amazon:
const AMAZON_CLIENT_ID = 'amzn1.application-oa2-client.665551daaad84ee2ba6a3c76f044d4df';
const AMAZON_CLIENT_SECRET = '6ef5dcd70d54bcffa23da1a79caa01ea2799823452d2377b39851ce581de9a0c';

// Passport session setup:
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the AmazonStrategy within Passport:
passport.use(new AmazonStrategy({
  clientID: AMAZON_CLIENT_ID,
  clientSecret: AMAZON_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/amazon/callback"
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      // To do: associate the Amazon account with a user record in the database, and return that user.
      // Find the user in the db, or, if they are already there, create the user in the db.
      // Return the user data from the db
      // console.log(profile._json.user_id);
      return done(null, profile._json.user_id);
    });
  }
));

// MIDDLEWARE -FOR PASSPORT AUTHENTICATION
// const cookieParser = require('cookie-parser');
const session = require('express-session');
// app.use(cookieParser());
// User session with the encryption 'secret', hold off on assigning cookie until login, set expiration on session cookie
app.use(session({ secret: 'keyboard cat', saveUninitialized: false, cookie: {maxAge: 10000000000} }));

// MIDDLEWARE - FOR PARSING OF FORMS AND JSON
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// MIDDLEWARE - FOR PATH
const path = require('path');

// WEB SOCKETS - AND RELATED DEPENDENCIES
const http = require('http');
const server = http.createServer(app);
// const io = require('socket.io').listen(server);

// ROUTERS - FOR API
const amazonRouter = require('./routers/amazonRouter');

// DATABASE
const mongoose = require('mongoose');
const mongoURI = 'mongodb://superuser:supersecret@ds231758.mlab.com:31758/amazon-personal-shopper';
mongoose.connect(mongoURI);

// Use passport
app.use(passport.initialize());
// Passport will automatically generate a session cookie upon login
app.use(passport.session());
// DEFAULT PATH FOR STATIC FILES - SERVES INDEX.HTML
app.use(express.static(path.join(__dirname, './../client/')));

// On "Login with Amazon" click, redirect here. Amazon gives the user an auth code.
app.get('/auth/amazon',
  passport.authenticate('amazon', { scope: ['profile'] }),
  function(req, res){
    // Because we are using OAuth, this function will not be called.
  })

// The user provides the server with the auth code, which the server gives to Amazon in exchange for a token.
app.get('/auth/amazon/callback', 
  passport.authenticate('amazon', { failureRedirect: '/'}),
  function(req, res) {
    res.redirect('/homepage');
  }
);

// Redirect to root when user logs out
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Middleware to verify authentication before granting access to the homepage
// req.isAuthenticated() checks for the existence of a session
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}


// ONCE LOGGED IN: ROUTES
app.get('/homepage', ensureAuthenticated, 
  (req,res) => { console.log(req.session);
    res.sendFile(path.resolve(__dirname + '/../client/home.html'))});

app.use('/api/amazon', amazonRouter);

// INTERCEPTS ALL STRAY REQUESTS
app.all('*', (req, res, next) => {
  console.log('catch all on the root');
  err = new Error('index.js - default catch all route - not found');
  err.functionName = 'server.js';
  err.status = 404;
  next(err);
});

// GLOBAL ERROR CATCHER
app.use((err, req, res, next) => {
  const error = err.functionName ? `${err.functionName} ${err}` : err;
  const errorStatus = err.status ? err.status : 500;
  res.status(errorStatus).end(`Server.js - ${error}`);
});

// EXPRESS SERVER - LISTEN ON 3000
server.listen(3000, () => console.log('Server is now listening on port 3000'));
