const express  = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db')



//Load config
dotenv.config({path: './config/config.env'});

//Connect to database
connectDB();

//ROute files
const tickets = require('./routes/tickets');

const app = express();

app.use(cors());

//BOdy parser
app.use(express.json());

//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

//MOunt routers
app.use('/api/v1/tickets', tickets);

app.use(errorHandler);










const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));


process.on('unhandledRejection',(err,promise) =>{
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});