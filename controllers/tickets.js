const Ticket = require ('../models/Tickets');
const asyncHandler = require('../middleware/async');

exports.getTickgets = asyncHandler(async (req,res,next) => {

  const tickets = await Ticket.find();

  res.status(200).json({success:true, count:tickets.length,data:tickets });
});

exports.getTickget = asyncHandler(async(req,res,next) => {
  const ticket = await Ticket.findById(req.params.id);

  if(!ticket){
    return  next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
  }

  res.status(200).json({success:true, data:ticket })
});

exports.createTickget = asyncHandler(async (req,res,next) => {
  try {
    const ticket = await Ticket.create(req.body);
  
    res.status(201).json({success:true,
    data:ticket})
    
  } catch (err) {
    res.status(400).json({success:false})
  }
});

exports.updateTickget = asyncHandler(async(req,res,next) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id,req.body,{
    runValidators:true
  });
  
  res.status(200).json({success:true, data:ticket })
});

exports.deleteTickget = asyncHandler(async(req,res,next) => {
  const ticket = await Ticket.findByIdAndDelete(req.params.id);

  res.status(200).json({success:true, data:{} })
});