
module.exports = function (app, mongoose, user) {

    var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
    
    var itemBillingSchema = mongoose.Schema({
        vendorName: String,
        date: Date,
        name: String,
        quantity: Number,
        location: String
    });

    var itemSchema = mongoose.Schema({
        itemId: String,
        name: String,
        quantity: Number,
        location: String
    });

    var Item = mongoose.model('Item', itemSchema);
    var ItemBilling = mongoose.model('ItemBilling', itemBillingSchema);

    app.get('/getAllItemBillings', function(req, res){
        console.log(req.user +" requested all Item Billings");
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

    app.post('/save', function(req, res){
        var createdBy = "";
        if(req.user)
            createdBy = req.user.username;
        
        var json = JSON.parse(req.body.data);
        json.forEach((item) => {
            
            var ve = item.vendor;
            var na = item.item;
            var qu = item.quantity;
            var lo = item.location;
            var da = item.date;
        
            console.log("request received by "+ createdBy +" for add item = " +ve +' '+ na +' '+ da +' '+ qu +' ' + lo);
        
            var newItemBilling = new ItemBilling({vendorName: ve, date: da, name: na, quantity: qu, location: lo});
            newItemBilling.save(function(err, testEvent) {
                    if (err) 
                        console.error('a' + err);
                    else {
                        console.log("Item Billing Saved!");
                }
            });
        
            updateOrAddItemUtil(na, qu, lo);
        });
        res.sendStatus(200);
    });
    
    function makeId(){
        var text = "";
        var combination = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
        for(var i=0; i < 4; i++)
            text += combination.charAt(Math.floor(Math.random() * combination.length));
        return text;
    }
    
    function updateOrAddItemUtil(na, qu, lo){
        console.log('update or add request received for '+ na + qu + lo);
        Item.findOneAndUpdate({name: na, location: lo},{$inc: {quantity: qu}}, function (err, key) {
            if (!key){
                var k = makeId();
                var newItem = new Item({itemId: k, name: na, quantity: qu, location: lo});
                newItem.save(function(err, testEvent) {
                        if (err) 
                            return console.error('d' + err);
                        else {
                            console.log("New Item Saved!");
                    }
                });
            } 
            else {
                console.log("Found and updated");
            }
        });
    }


    app.get('/getAllItems', function(req, res){
        console.log("here");
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

    app.post('/deleteItem', function(req, res){
        console.log("Delete Item");

        ItemBilling.findOne({_id: req.body.id},function (err, key) {
            if (err)
                return console.error('Oops! We got an error '+err);
            else if(key) {
                console.log("this is key" + key);
                var neqQua = key.quantity * (-1);
                Item.findOneAndUpdate({name: key.name, location: key.location},{$inc: {quantity: neqQua}}, function (err, key) {
                    if (!key){
                        console.log("not found");
                    } 
                    else {
                        ItemBilling.deleteOne({_id: req.body.id}, function (err, key) {
                            console.log("deleted "+ err + key);
                        });
                        console.log("Found and updated");
                    }
                });
            }
            else
                console.log("some error maybe");
                res.send('error');
        });
    });

    var transferRoutes = require('../routes/transfer.js')(app, mongoose, user, Item);
}