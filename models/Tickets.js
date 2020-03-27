const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  name:{
    type:String,
    required: [true, 'Please add a ticket']
  }
});

module.exports = mongoose.model('Tickets',TicketSchema);