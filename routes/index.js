
var flash = require("connect-flash");
var passport = require("passport");

module.exports = function (app, mongoose) {

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

	app.get('/login', function(req, res){
        console.log('login page from here');
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

    var itemBillingRoutes = require('../routes/item.js')(app, mongoose);
    var refDataRoutes = require('../routes/refdata.js')(app, mongoose);
}

