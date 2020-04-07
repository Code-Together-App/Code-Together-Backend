const express = require('express');
const {getTickgets, getTickget, updateTickget, createTickget,deleteTickget, ticketPhotoUpload} = require('../controllers/tickets');
const Ticket = require('../models/Tickets');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router();

router
  .route('/')
  .get(advancedResults(Ticket),getTickgets)
  .post(createTickget)

router.route('/:id/photo').put(ticketPhotoUpload);

router
  .route('/:id')
  .get(getTickget)
  .put(updateTickget)
  .delete(deleteTickget)


module.exports = router;
