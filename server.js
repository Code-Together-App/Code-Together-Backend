const path = require('path');
const express  = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

//Load config
dotenv.config({path: './config/config.env'});

//Connect to database
connectDB();

//ROute files
const tickets = require('./routes/tickets');
const auth = require('./routes/auth');

const app = express();

app.use(cors());

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

//File uploading
app.use(fileupload());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//MOunt routers
app.use('/api/v1/tickets', tickets);
app.use('/api/v1/auth',auth)

app.use(errorHandler);



const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));


process.on('unhandledRejection',(err,promise) =>{
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});