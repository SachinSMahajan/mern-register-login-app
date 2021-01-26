const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConnection = require('./config/db')
const errorController = require('../server/controllers/errorController')
require('dotenv').config()

dbConnection();
const app = express();
app.use(bodyParser.json());
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

const authRoute = require('./routes/authRoute')

app.use('/api/',authRoute);

app.use(errorController);

app.use((req,res,next)=>{
    res.sendStatus(404).json({
        success:false,
        message:"page not found"
    })
})
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`);
})