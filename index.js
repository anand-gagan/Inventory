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


var routes = require("./routes")(app, mongoose);

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


var transferSchema = mongoose.Schema({
	transferId: String,
	itemName: String,
	desc: String,
	quantity: Number,
	source: String,
	destination: String,
	state: String
});

var Transfer = mongoose.model('Transfer', transferSchema);

app.get('/', function(req, res){
	// if(!req.user)
	// 	res.redirect('/login?url=/home');
	// else
		res.render('demo');
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

app.get('/transferPage', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
	res.render('TransferRequest');
});

app.get('/itemBillings', require('connect-ensure-login').ensureLoggedIn(),  function(req, res){
	res.render('MyItemsBilling');
});

app.post('/login', passport.authenticate("local", {
	successRedirect:'/home', failureRedirect:"/login", failureFlash :true
}), function(req , res) {
});

app.get('/register', function(req, res){
	if(!req.user)
		res.redirect('/login');
	else if(req.user.username != "naveen")
		res.redirect('/home');
	else {
		res.render('register');
	}
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

app.get('/getMyTransferRequests', function(req, res){
	console.log("here transfer requests get call");
	Transfer.find({source: req.user.username}, function (err, key) {
		if (err)
			return console.error('Oops! We got an error '+err);
		else if(key) {
			
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(key));
		}
	});
});


app.get('/getRecivedRequests', function(req, res){
	console.log("here Received transfer requests get call");
	Transfer.find({destination: req.user.username}, function (err, key) {
		if (err)
			return console.error('Oops! We got an error '+err);
		else if(key) {
			
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(key));
		}
	});
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
	var traId = makeId();
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

	var newTransfer = new Transfer({transferId: traId, itemName: key.name, desc: key.desc, quantity: qu, source: req.user.username, destination: loc, state : "pending"});
	newTransfer.save(function(err, testEvent) {
			if (err) 
				console.error('a' + err);
			else {
				console.log("New Transfer Request Saved!");
		}
	});
	///		updateOrAddItemUtil(key.name, key.desc, key.quantity, loc);
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

	var cl= req.body.client;
	var na = req.body.Name;
	var des = req.body.Description;
	var qu = req.body.Quantity;
	var lo = req.body.Location;

	console.log("request received for add item = " +cl +' '+ na +' '+ des +' '+ qu +' ' + lo);

	var datetime = new Date();

	var newItemBilling = new ItemBilling({clientName: cl, date: datetime, itemName: na, desc: des, quantity: qu, location: lo});
	newItemBilling.save(function(err, testEvent) {
			if (err) 
				console.error('a' + err);
			else {
				console.log("Item Billing Saved!");
		}
	});

	updateOrAddItemUtil(na, des, qu, lo);
	res.sendStatus(200);
});

function makeId(){
	var text = "";
	var combination = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
	for(var i=0; i < 4; i++)
		text += combination.charAt(Math.floor(Math.random() * combination.length));
	return text;
}

function updateOrAddItemUtil(name, desc, qu, lo){
	console.log('update or add request received for '+ name + desc + qu + lo);
	Item.findOneAndUpdate({name: name, desc: desc, location: lo},{$inc: {quantity: qu}}, function (err, key) {
		if (!key){
			var k = makeId();
			var newItem = new Item({itemId: k, name: name, desc: desc, quantity: qu, location: lo, state: "false"});
			newItem.save(function(err, testEvent) {
					if (err) 
						return console.error('d' + err);
					else {
						console.log("New Item Saved!");
				}
			});
		} 
		else {
			console.log(err + ' s ' + key);
			console.log("Found and updated");
        }
    });
}

app.get('/home', function(req, res){
	if(!req.user)
		res.redirect('/login?url=/home');
	else {
		res.render('home');
	}
});

app.get('/admin', function(req, res){
	if(!req.user)
		res.redirect('/login');
	else if(req.user.username != "naveen")
		res.redirect('/home');
	else {
		res.render('admin');
	}
});

app.listen(process.env.PORT || 3001, function(){
	console.log('Server started at port 3001');
});