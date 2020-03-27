const express  = require('express');
const dotenv = require('dotenv');

//ROute files
const tickets = require('./routes/tickets');


//Load config
dotenv.config({path: './config/config.env'});

const app = express();

//MOunt routers
app.use('/api/v1/tickets', tickets);











const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));