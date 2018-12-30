const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const process = require('./nodemon.json');
const userRoutes = require('./api/routes/user');



mongoose.connect('mongodb://127.0.0.1:27017/mydb', { useNewUrlParser: true } );


app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//
/*cors handle*/
app.use((req,res,next)=>{
   res.header("Access-Control-Allow-Origin","*");
   res.header(
    "Access-Control-Allow-Headers","Orgin, x-Requested-with, Content-Type, Accept, Authorization",{ useNewUrlParser: true });
      if(req.method=='OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
    return res.status(200).json({});
   }
   next();
});


//Route which should handle request
app.use('/user',userRoutes);



//error handling for unknown request
app.use((req,res,next) => {
 const error = new Error('Not Found');
 error.status=404;
 next(error);
});

app.use((error , req ,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
});

module.exports = app ;
