const Ticket = require ('../models/Tickets');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

exports.getTickgets = asyncHandler(async (req,res,next) => {
    let query;
    
    
    //Copy req.query
    const reqQuery = { ...req.query };

    //Fields to exclude
    const removeFields = ['select','page','limit'];

    //Loop over removeFields and delete tem from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    //Create query string
    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //Finding resource
    query = Ticket.find(JSON.parse(queryStr));

    //Select Fields
    if(req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      console.log(fields)
    }

    
    
    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    
    const limit = parseInt(req.query.limit,10) || 1;
    
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);
    
    //Executing query
    const tickets = await query;

    res.status(200).json({success:true, count:tickets.length,data:tickets });
 
});

exports.getTickget = asyncHandler(async(req,res,next) => {
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket){
      return next(new ErrorResponse(`Ticket not found with id of ${req.params.id}`,404));
    }
  
    res.status(200).json({success:true, data:ticket })
});

exports.createTickget = asyncHandler(async (req,res,next) => {
    const ticket = await Ticket.create(req.body);
  
    res.status(201).json({
      success:true,
      data:ticket});
  
});

exports.updateTickget = asyncHandler(async(req,res,next) => {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id,req.body,{
      runValidators:true
    });
    if(!ticket) {
      return next(new ErrorResponse(`Ticket not found with id of ${req.params.id}`,404));
    }
  
    res.status(200).json({success:true, data:ticket })
});


exports.deleteTickget = asyncHandler(async(req,res,next) => {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if(!ticket) {
      return next(new ErrorResponse(`Ticket not found with id of ${req.params.id}`,404));
    }
  
    res.status(200).json({success:true, data:{} })
});