
var flash = require("connect-flash");

module.exports = function (app, mongoose, user, passport) {

    function snakeCase(key) {
        var result = key.replace( /([A-Z])/g, " $1" );
        return result.split(' ').join('_').toLowerCase();
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
            res.redirect('/login');
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
        if(!req.user)
            res.redirect('/login');
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

        user.find({username: req.body.username}, function (err, key) {
            if (err)
                return console.error('Oops! We got an error '+err);
            else if(!key || key == "") {
                var newUser= ({
                    name:req.body.name,
                    username:req.body.username,
                    isClient: false
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
            }
            else{
                console.log('User already present');
                res.sendStatus(500);
            }
        });

    });


    app.post('/client', function(req, res){
        var client= req.body.client;
        user.find({username: client}, function (err, key) {
            if (err)
                return console.error('Oops! We got an error '+err);
            else if(!key  || key == "") {
                var newUser= ({
                    name:client,
                    username:client.split(' ').join('_'),
                    isClient: true
                });
                user.register(newUser , "fakePass" , function(err , user){
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
            }
            else
                res.send('Client already present');
        });

    });

    app.get('/logout', function(req, res) {
        req.logout();
        req.flash("success" , "Successfully logged out");
        res.redirect('/');
    })

    var refDataRoutes = require('../routes/refdata.js').routes(app, mongoose, user);
    var itemBillingRoutes = require('../routes/item.js')(app, mongoose, user, refDataRoutes);


    app.get('/*', function(req, res) {
        res.render('error');
    })
}

