var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require("passport");
var localStatergy = require("passport-local");
var flash = require("connect-flash");
var app = express();
var user = require("./db");
var flashMessages = require('flash-messages');


app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://gagan:gagan@inventory.vxmly.mongodb.net/inventory?retryWrites=true&w=majority');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log("Connected To MLab cloud database");
});



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/public'));
app.use(require("express-session")({
    secret:"hello friends",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req ,res , next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success= req.flash("success");
    next();
});

passport.use(new localStatergy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser()); 


var routes = require("./routes")(app, mongoose, user, passport);


app.listen(process.env.PORT || 3001, function(){
	console.log('Server started at port 3001');
});