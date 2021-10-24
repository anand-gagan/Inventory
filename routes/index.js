
var flash = require("connect-flash");

module.exports = function (app, mongoose, user, passport) {

    function snake_case(str) {
        return str && str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .map(s => s.toLowerCase())
            .join('_');
    }

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

    app.get('/clientItemsPage', require('connect-ensure-login').ensureLoggedIn(),  function(req, res){
        res.render('clientItems');
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
        // if(!req.user)
        //     res.redirect('/login');
        // else if(req.user.username != "naveen")
        //     res.redirect('/home');
        // else {
            res.render('register');
        // }
    });

    app.post('/register', function(req, res) {
        console.log('register post page from here');
        var newUser= ({
            name:snake_case(req.body.name),
            username:snake_case(req.body.username),
            isVerified:'false',
            isClient: true
        });
        user.register(newUser , req.body.password , function(err , user){
            if(err)
            {
                console.log("Error in registering" + err);
                res.sendStatus(500);
            }
            else{
                console.log("success" , "You are successfully registered!");
                res.sendStatus(200);
            }
        });
    });


    app.post('/client', function(req, res){
        var client= snake_case(req.body.client);
        var newUser= ({
            name:client,
            username:client,
            isVerified:'false',
            isClient: true
        });
        user.register(newUser , "fake" , function(err , user){
            if(err)
            {
                console.log("Error in registering" + err);
                res.sendStatus(500);
            }
            else{
                console.log("success" , "Client Added Successfully");
                res.sendStatus(200);
            }
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        req.flash("success" , "Successfully logged out");
        res.redirect('/');
    })

    var itemBillingRoutes = require('../routes/item.js')(app, mongoose, user);
    var refDataRoutes = require('../routes/refdata.js')(app, mongoose, user);

    app.get('/*', function(req, res) {
        res.render('error');
    })
}

