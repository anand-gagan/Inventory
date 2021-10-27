module.exports = function (app, mongoose, user, Item) {

    var bodyParser = require('body-parser');

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    var transferSchema = mongoose.Schema({
        transferId: String,
        name: String,
        quantity: Number,
        source: String,
        destination: String,
        state: String
    });
    
    var Transfer = mongoose.model('Transfer', transferSchema);
  
    function makeId(){
        var text = "";
        var combination = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
        for(var i=0; i < 4; i++)
            text += combination.charAt(Math.floor(Math.random() * combination.length));
        return text;
    }

    app.get('/getMyTransferRequests', function(req, res){
        console.log("here transfer requests get call");
        var source = [req.user.username];
        if(req.user.username == "naveen")
            source.push("office");
        setTimeout(function () {
            Transfer.find({source:{$in: source}, state: "pending"}, function (err, key) {
                if (err)
                    return console.error('Oops! We got an error '+err);
                else if(key) {
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(key));
                }
            });
        }, 2000);
    });


    app.get('/getRecivedRequests', function(req, res){
        console.log("here Received transfer requests get call");
        var destination = [req.user.username];
        if(req.user.username == "naveen"){
            user.find({isClient: true},function (err, key) {
                destination.push("office");
                if (err)
                    return console.error('Oops! We got an error '+err);
                else if(key) {
                    key.forEach((obj) => {destination.push(obj.username)});
                }
            });
        }
        setTimeout(function () {
            Transfer.find({destination: {$in: destination}, state: "pending"}, function (err, key) {
                if (err)
                    return console.error('Oops! We got an error '+err);
                else if(key) {
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(key));
                }
            });
        }, 2000);
    });


    app.post('/transfer', function(req, res){
        var id= req.body.id;
        var dest = req.body.location;
        var source = req.user.username;
        var qu = req.body.quantity;

        if(dest == "" || id == "" || qu == "")
        {
            console.log("Incorrect Data for transfer");
            res.sendStatus(500);
            return;
        }
        console.log('transfer request came');
        var traId = makeId();

        Item.findOne({itemId: id, location: source},function (err, key) {
            if (err)
                console.error('error occured : ' + err);
            else if(key && key.quantity >= Number(qu))
            {
                Item.updateOne({itemId: id, location: source}, {quantity: Number(key.quantity) - Number(qu)},function (err, key) {
                    if (err) 
                        console.error('error occured : ' + err);
                    else {
                        console.log("Item's qunatity reduced from source");
                    }
                });

                var newTransfer = new Transfer({transferId: traId, name: key.name, quantity: qu, source: source, destination: dest, state : "pending"});
                newTransfer.save(function(err, testEvent) {
                    if (err) 
                        console.error('error occured : ' + err);
                    else {
                        console.log("New Transfer Request Saved!");
                    }
                });
                res.sendStatus(200);
            }
            else{
                console.log("NOt Found or Found but quantity not available");
                res.sendStatus(500);
            }
        });
    });

    app.post('/transfer/approve', function(req, res){
        var transferId= req.body.transferId;
        Transfer.findOneAndUpdate({transferId: transferId, state: "pending"},{state: "approved"},function (err, key) {
            if (key){
                incrItem(key.name, key.quantity, key.destination, res, key.source);
            } 
            else {
                console.log("Transfer Request Not Found");
                res.sendStatus(500);
            }

        });
    });

    app.post('/transfer/delete', function(req, res){
        var transferId= req.body.transferId;
        Transfer.findOneAndUpdate({transferId: transferId, state: "pending"},{state: "deleted"},function (err, key) {
            if (key){
                incrItem(key.name, key.quantity, key.source, res, key.source);
            } 
            else {
                console.log("Transfer Request Not Found");
                res.sendStatus(500);
            }

        });
    });


    function incrItem(na, qu, lo, res, updatedBy){
        console.log('Increment Item Request received for '+ na + qu + lo + updatedBy);
        Item.findOneAndUpdate({name: na, location: lo},{$inc: {quantity: qu}, lastUpdBy: updatedBy }, function (err, key) {
            if (!key){
                var k = makeId();
                var newItem = new Item({itemId: k, name: na, quantity: qu, location: lo, lastUpdBy: updatedBy });
                newItem.save(function(err, testEvent) {
                        if (err) {
                            console.error('d' + err);
                            res.sendStatus(500);
                        } 
                        else {
                            console.log("New Item Saved!");
                            res.sendStatus(200);
                    }
                });
            } 
            else {
                console.log("Found and updated");
                res.sendStatus(200);
            }
        });
    }

}