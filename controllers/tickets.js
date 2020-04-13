const path = require('path');
const Ticket = require ('../models/Tickets');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

exports.getTickets = asyncHandler(async (req,res,next) => {
    
    res.status(200).json(res.advancedResults);
 
});

exports.getTicket = asyncHandler(async(req,res,next) => {
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket){
      return next(new ErrorResponse(`Ticket not found with id of ${req.params.id}`,404));
    }
  
    res.status(200).json({success:true, data:ticket })
});

exports.createTicket = asyncHandler(async (req,res,next) => {
    //Add user to req.body
    req.body.user = req.user.id;

    const ticket = await Ticket.create(req.body);
  
    res.status(201).json({
      success:true,
      data:ticket});
  
});

exports.updateTicket = asyncHandler(async(req,res,next) => {
    let ticket = await Ticket.findById(req.params.id)

    if(!ticket) {
      return next(new ErrorResponse(`Ticket not found with id of ${req.params.id}`,404));
    }

    //Make sure user is ticket owner
    if(ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${ req.params.id} is not authorized to updated this ticket`,401));
    }

    ticket = await Ticket.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators:true
    })
    
    res.status(200).json({success:true, data:ticket })
});


exports.deleteTicket = asyncHandler(async(req,res,next) => {
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket) {
      return next(new ErrorResponse(`Ticket not found with id of ${req.params.id}`,404));
    }
  //Make sure user is ticket owner
  if(ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${ req.params.id} is not authorized to delete this ticket`,401));
  }
  ticket.remove();

    res.status(200).json({success:true, data:{} })
});

//upload photo for ticket
//route PUT 

exports.ticketPhotoUpload = asyncHandler(async(req,res,next) => {
  const ticket = await Ticket.findById(req.params.id);

  if(!ticket) {
    return next(new ErrorResponse(`Ticket not found with id of ${req.params.id}`,404));
  }

  //Make sure user is ticket owner
  if(ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${ req.params.id} is not authorized to update this ticket`,401));
  }

  if(!req.files) {
    return next(new ErrorResponse(`Please upload a file`,400));
  }
  const file = req.files.file;

  //Make sure the image is a photo
  if(!file.mimetype.startsWith('image')){
    return next(new ErrorResponse(`Please upload an image file`,400));
  }

  //Check filesize
  if(file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,400));
  }

  //Create custom filename
  file.name = `photo_${ticket._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if(err) {
      console.error(err);
      return next(
        new ErrorResponse(
          `Problem with file upload`,500));
    }

    await Ticket.findByIdAndUpdate(req.params.id,{ photo:file.name });

    res.status(200).json({
      success:true,
      data:file.name
    })
  })
  console.log(file.name);
});