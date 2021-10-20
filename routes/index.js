
var flash = require("connect-flash");

module.exports = function (app, mongoose, user, passport) {

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
        res.render('addBills');
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


    app.get('/', function(req, res){

        console.log('slash page from here');
        if(!req.user)
            res.redirect('/login?url=/home');
        else
            res.render('home');
    });

    app.post('/login', passport.authenticate("local", {
        successRedirect:'/home', failureRedirect:"/login", failureFlash :true
    }), function(req , res) {
        console.log('login post page from here');
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
        console.log('register post page from here');
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

    var itemBillingRoutes = require('../routes/item.js')(app, mongoose, user);
    var refDataRoutes = require('../routes/refdata.js')(app, mongoose, user);
}

