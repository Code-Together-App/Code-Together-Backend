const express = require('express');
const {getTickets, getTicket, updateTicket, createTicket,deleteTicket, ticketPhotoUpload} = require('../controllers/tickets');
const Ticket = require('../models/Tickets');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(Ticket),getTickets)
  .post(protect,createTicket)

router.route('/:id/photo').put(protect, authorize('admin'), ticketPhotoUpload);

router
  .route('/:id')
  .get(getTicket)
  .put(protect, updateTicket)
  .delete(protect, deleteTicket)

 
module.exports = router;
