const path = require('path');
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
    const limit = parseInt(req.query.limit,10) || 4;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Ticket.countDocuments();
    
    query = query.skip(startIndex).limit(limit);
    
    //Executing query
    const tickets = await query;

    //Pagination result
    const pagination ={};

    if(endIndex < total) {
      pagination.next ={
        page: page + 1,
        limit
      }
    }

    if(startIndex > 0) {
      pagination.prev = {
          page:page - 1,
          limit
      }
    }

    res.status(200).json({success:true, count:tickets.length, pagination,data:tickets });
 
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

//upload photo for ticket
//route PUT 

exports.ticketPhotoUpload = asyncHandler(async(req,res,next) => {
  const ticket = await Ticket.findById(req.params.id);

  if(!ticket) {
    return next(new ErrorResponse(`Ticket not found with id of ${req.params.id}`,404));
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