var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require("passport");
var localStatergy = require("passport-local");
var flash = require("connect-flash");
var user = require("./db");
var flashMessages = require('flash-messages');
var app = express();

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

var itemSchema = mongoose.Schema({
	itemId: String,
	name: String,
	desc: String,
	quantity: Number,
	location: String,
	state: String
});

var itemBillingSchema = mongoose.Schema({
	clientName: String,
	date: Date,
	itemName: String,
	desc: String,
	quantity: Number,
	location: String
});

var Item = mongoose.model('Item', itemSchema);
var ItemBilling = mongoose.model('ItemBilling', itemBillingSchema);

app.get('/', function(req, res){
	if(!req.user)
		res.redirect('/login?url=/home');
	else
		res.render('home');
});

app.get('/login', function(req, res){
	res.render('login');
});

app.get('/addItem', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
	res.render('addItem');
});

app.get('/myItems', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
	res.render('MyItems');
});

app.get('/itemBillings', require('connect-ensure-login').ensureLoggedIn(),  function(req, res){
	res.render('MyItemsBilling');
});

app.post('/login', passport.authenticate("local", {
	successRedirect:'/home', failureRedirect:"/login", failureFlash :true
}), function(req , res) {
});

app.get('/register', function(req, res){
	res.render('register');
});

app.post('/register', function(req, res) {
    var newUser= ({
		name:req.body.name,
		username:req.body.username,
		isVerified:'false'
	});
    user.register(newUser , req.body.password , function(err , user){
        if(err)
        {
            console.log("Error in registering");
            req.flash("error" , err.message);
            res.redirect("/signup");
		}
		req.flash("success" , "You are successfully registered!");
        res.redirect("/login");
    });
});

app.get('/logout', function(req, res) {
    req.logout();
    req.flash("success" , "Successfully logged out");
    res.redirect('/');
})

app.get('/getAllItems', function(req, res){
	console.log("here");
	console.log(req.user +" aaaa");
	if(!req.user)
		res.send('Please log in');
	else {
		Item.find({location: { $in: [ req.user.username, "office" ] }},function (err, key) {
			if (err)
				return console.error('Oops! We got an error '+err);
			else if(key) {
				
				res.setHeader('Content-Type', 'application/json');
    			res.send(JSON.stringify(key));
			}
			else
				res.send('error');
		});
	}
});

app.get('/getAllItemBillings', function(req, res){
	console.log("here");
	console.log(req.user +" aaaa");
	if(!req.user)
		res.send('Please log in');
	if(req.user.username != "naveen")
		res.send('Not Authorized');
	else {
		ItemBilling.find(function (err, key) {
			if (err)
				return console.error('Oops! We got an error '+err);
			else if(key) {
				
				res.setHeader('Content-Type', 'application/json');
    			res.send(JSON.stringify(key));
			}
			else
				res.send('error');
		});
	}
});

app.post('/transfer', function(req, res){
	var itemId= req.body.id;
	var loc = req.body.location;
	var qu = req.body.quantity;
	console.log('transfer request came');
	function makeId(){
		var text = "";
    	var combination = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
    	for(var i=0; i < 4; i++)
        	text += combination.charAt(Math.floor(Math.random() * combination.length));
    	return text;
	}
	var k = makeId();
	Item.findOne({itemId: itemId, location: "office"},function (err, key) {
		if (err)
			console.error('b' + err);
        else if(key && key.quantity > Number(qu))
        {
			Item.updateOne({itemId: itemId, location: "office"}, {quantity: Number(key.quantity) - Number(qu)},function (err, key) {
				if (err) 
					console.error('c' + err);
				else {
					console.log("Item's qunatity reduced from source");
				}
			});
			Item.findOne({name: key.name, desc: key.desc, location: "paras"},function (err, key) {
				if (err)
					console.error('b' + err);
				else if(key)
				{
					
					Item.updateOne({name: key.name, desc: key.desc, location: "paras"}, {quantity: Number(key.quantity) + Number(qu)},function (err, key) {
						if (err) 
							console.error('c' + err);
						else {
							console.log("Item was already added, updated quantity");
						}
					});
				}
				else{
		
					var newItem = new Item({itemId: k, name: key.name, desc: key.desc, quantity: qu, location: "paras", state: "false"});
					newItem.save(function(err, testEvent) {
							if (err) 
								return console.error('d' + err);
							else {
								console.log("New Item Saved!");
						}
					});
				}
			});
        }
		else{
			console.log("NOt Found");
		}

	res.sendStatus(200);
});
});

app.post('/save', function(req, res){
	var createdBy = "";
	if(req.user)
		createdBy = req.user.username;

	console.log(createdBy);

	// if(createdBy != "naveen")
	// 	res.sendStatus(403);

	function makeId(){
		var text = "";
    	var combination = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
    	for(var i=0; i < 4; i++)
        	text += combination.charAt(Math.floor(Math.random() * combination.length));
    	return text;
	}
	var cl= req.body.client;
	var na = req.body.Name;
	var des = req.body.Description;
	var qu = req.body.Quantity;
	//var lo = req.body.Location;
	var lo = "office";

	console.log(cl + na + des + qu + lo);

	var datetime = new Date();
	var k = makeId();

	var newItemBilling = new ItemBilling({clientName: cl, date: datetime, itemName: na, desc: des, quantity: qu, location: lo});
	newItemBilling.save(function(err, testEvent) {
			if (err) 
				console.error('a' + err);
			else {
				console.log("Item Billing Saved!");
		}
	});

	Item.findOne({name: na, desc: des},function (err, key) {
		if (err)
			console.error('b' + err);
        else if(key)
        {
			
			Item.updateOne({name: na, desc: des,location: lo}, {quantity: Number(key.quantity) + Number(qu)},function (err, key) {
				if (err) 
					console.error('c' + err);
				else {
					console.log("Item was already added, updated quantity");
				}
			});
        }
		else{

			var newItem = new Item({itemId: k, name: na, desc: des, quantity: qu, location: lo, state: "false"});
			newItem.save(function(err, testEvent) {
					if (err) 
						return console.error('d' + err);
					else {
						console.log("New Item Saved!");
				}
			});
		}
    });
	res.sendStatus(200);
});

app.get('/home', function(req, res){
	if(!req.user)
		res.redirect('/login?url=/home');
	else {
		res.render('home');
	}
});

app.listen(process.env.PORT || 3001, function(){
	console.log('Server started at port 3001');
});