module.exports.routes = function (app, mongoose, user) {

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
        var vendor = req.body.vendor;

        Vendor.find({name: vendor}, function (err, key) {
            if (err)
                return console.error('Oops! We got an error '+err);
            else if(!key  || key == "") {

                var newVendor = new Vendor({name: vendor});
                newVendor.save(function(err, testEvent) {
                    if (err) 
                        console.error('a' + err);
                    else {
                        console.log("Vendor Saved!");
                    }
                });
                res.sendStatus(200);
            }
            else{
                console.log('Already present');
                res.sendStatus(500);
            }
        });

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

        ItemRef.find({name: itemRef}, function (err, key) {
            if (err)
                console.error('Oops! We got an error '+err);
            else if(!key || key == "") {
                var newItemRef = new ItemRef({name: itemRef});
                newItemRef.save(function(err, testEvent) {
                    if (err) 
                        console.error('a' + err);
                    else {
                        console.log("Item Ref Saved!");
                    }
                });
            }
            else{
                console.log('Already present');
                res.sendStatus(500);
            }
        });

        res.sendStatus(200);
    });

    module.exports.vendor = Vendor;
    module.exports.itemref = ItemRef;

    module.exports.getVendorName = async function (item){
        try{
            await Vendor.findOne({_id: item.vendorId}, function (err, key) {
                if (key){
                    console.log("vendor name resp: " + key);
                    item.vendor = key.name;
                    return;
                }
            });
        } catch(e){
            console.log("error here: " + e);
            return;
        }
    }

    module.exports.getItemName = async function (item){
        try{
            await ItemRef.findOne({_id: item.itemId}, function (err, key) {
                if (key){
                    console.log("item name resp: " + key);
                    item.name = key.name;
                }
                return;
            });
        } catch(e){
            console.log("error here: " + e);
            return;
        }
    }

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
