module.exports = function (app, mongoose, user) {

    var bodyParser = require('body-parser');

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    var vendorSchema = mongoose.Schema({
        name: String
    });

    var ItemRefSchema = mongoose.Schema({
        name: String
    });

    var Vendor = mongoose.model('Vendor', vendorSchema);
    var ItemRef = mongoose.model('ItemRef', ItemRefSchema);

    app.get('/vendor', function(req, res){
        console.log("get vendor call");
        Vendor.find(function (err, key) {
            if (err)
                return console.error('Oops! We got an error '+err);
            else if(key) {
                
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(key));
            }
            else
                res.send('error');
        });
    });

    app.post('/vendor', function(req, res){
        var vendor= req.body.vendor;
        var newVendor = new Vendor({name: vendor});
        newVendor.save(function(err, testEvent) {
                if (err) 
                    console.error('a' + err);
                else {
                    console.log("Vendor Saved!");
            }
        });
        res.sendStatus(200);
    });
    
    app.get('/item-ref', function(req, res){
        console.log("get item ref call");
        ItemRef.find(function (err, key) {
            if (err)
                return console.error('Oops! We got an error '+err);
            else if(key) {
                
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(key));
            }
            else
                res.send('error');
        });
    });

    app.post('/item-ref', function(req, res){
        var itemRef= req.body.item;
        var newItemRef = new ItemRef({name: itemRef});
        newItemRef.save(function(err, testEvent) {
                if (err) 
                    console.error('a' + err);
                else {
                    console.log("Item Ref Saved!");
            }
        });
        res.sendStatus(200);
    });

    app.get('/user-ref', function(req, res){
        console.log("get user ref call");
        user.find(function (err, key) {
            if (err)
                return console.error('Oops! We got an error '+err);
            else if(key) {
                
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(key));
            }
            else
                res.send('error');
        });
    });

}