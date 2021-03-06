var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
             name:String,
             username:String,
             isClient:String,
             password:String
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("user", userSchema);