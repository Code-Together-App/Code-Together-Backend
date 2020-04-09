const express = require('express');
const {getTickgets, getTickget, updateTickget, createTickget,deleteTickget, ticketPhotoUpload} = require('../controllers/tickets');
const Ticket = require('../models/Tickets');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(Ticket),getTickgets)
  .post(protect,authorize('admin'), createTickget)

router.route('/:id/photo').put(protect, authorize('admin'), ticketPhotoUpload);

router
  .route('/:id')
  .get(getTickget)
  .put(protect, authorize('admin'), updateTickget)
  .delete(protect, authorize('admin'), deleteTickget)

 
module.exports = router;
