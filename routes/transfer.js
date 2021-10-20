module.exports = function (app, mongoose, user, Item) {

    var bodyParser = require('body-parser');

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

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


}