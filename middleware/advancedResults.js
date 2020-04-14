const advancedResults =(model, populate) => async (req, res, next) =>{
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
  query = model.find(JSON.parse(queryStr));

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
  const total = await model.countDocuments();
  
  query = query.skip(startIndex).limit(limit);
  
  //Executing query
  const results = await query;

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

  res.advancedResults = {
    success:true,
    count:results.length,
    pagination,
    data:results

  }
  next();
};

module.exports = advancedResults;