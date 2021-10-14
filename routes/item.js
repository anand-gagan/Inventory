
module.exports = function (app, mongoose) {

    var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
    
    var itemBillingSchema = mongoose.Schema({
        clientName: String,
        date: Date,
        itemName: String,
        desc: String,
        quantity: Number,
        location: String
    });

    var itemSchema = mongoose.Schema({
        itemId: String,
        name: String,
        desc: String,
        quantity: Number,
        location: String,
        state: String
    });


    var Item = mongoose.model('Item', itemSchema);
    var ItemBilling = mongoose.model('ItemBilling', itemBillingSchema);
    app.get('/getAllItemBillings', function(req, res){
        console.log("from seperate routes");
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

}