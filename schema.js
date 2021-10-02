var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
	itemId: String,
	name: String,
	desc: String,
	quantity: Number,
	location: String,
	state: String
});

var itemBillingSchema = mongoose.Schema({
	clientName: String,
	date: Date,
	itemName: String,
	desc: String,
	quantity: Number,
	location: String
});