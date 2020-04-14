const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  name:{
    type:String,
    required: [true, 'Please add a ticket name']
  },
  description:{
    type:String,
    required: [true, 'Please describe the task']
  },
  status:{
    type:String,
    required: [true, 'Please assign status for the ticket']
  },
  createdAt:{
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Tickets',TicketSchema);