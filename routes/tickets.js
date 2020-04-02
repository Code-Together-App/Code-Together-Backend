const express = require('express');
const {getTickgets, getTickget, updateTickget, createTickget,deleteTickget, ticketPhotoUpload} = require('../controllers/tickets')
const router = express.Router();

router
  .route('/')
  .get(getTickgets)
  .post(createTickget)

router.route('/:id/photo').put(ticketPhotoUpload);

router
  .route('/:id')
  .get(getTickget)
  .put(updateTickget)
  .delete(deleteTickget)


module.exports = router;
