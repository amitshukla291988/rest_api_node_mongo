const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const checkAuth = require('../middleware/check_auth');


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});
//const upload = multer({ dest:'uploads/' });
const fileFilter = (req,file,cb)=> {
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null,true);
    }else{
       // cb(new Error('Invalid Format'),false);
        cb(null,false);
    }
};

const upload = multer({
    storage:storage ,
    limits:{
    fileSize: 1024 * 1024 * 5
    },
    fileFilter:fileFilter
 });
const User = require('../models/user');
//handle incoming get request
router.get('/:userId',(req , res, next) => {
    const id=req.params.userId ;
    res.status(200).json({
        message: "It's work for get Id :"+id
    });
});
/*
{ fieldname: 'userImage',
  originalname: '41ABJJTIhmL.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'uploads/',
  filename: '76da021905323d445d0b8d4847623fff',
  path: 'uploads/76da021905323d445d0b8d4847623fff',
  size: 27704 }
*/
/*npm install bcrypt --save*/



router.post('/signup',(req,res,next)=>{
    User.find({email:req.body.email}).exec()
    .then(user=>{
        if(user.length>=1){
            return res.status(409).json({
                message: 'Mail exists'
            });
        }else{
            bcrypt.hash(req.body.password,10, function(err, hash) {

            if(err){
                return res.status(500).json({
                    error : err
                });
            }else{
                 const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                name: req.body.name,
                password:hash
             });
                     user.save()
                    .then(result => {
                        res.status(201).json({
                        message: "user created ",
                        data:user
                      });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });

                    });

            }
        });
        }
    });
});

router.post('/check',(req,res,next)=>{
    res.status(200).json({
        message:'Successfull show check'+ process.env.KEY

    });
});
router.post('/login',(req,res,next)=>{
    User.find({email:req.body.email}).exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(401).json({
                message: 'Auth Faild'
            });
        }else{
            bcrypt.compare(req.body.password, user[0].password, function(err, result) {
               if(err){
                return res.status(401).json({
                message: 'Auth Faild'
                 });
               }
               //jwt_key
               if(result){

                const token = jwt.sign({
                    email:user[0].email,
                    userId:user[0]._id
                }, 'secret' ,
                {
                    expiresIn: "1h"
                });

                return res.status(200).json({
                    message:"Successfull login",
                    tokens : token
                });
               }

               return res.status(401).json({
                message: 'Auth Faild'
                 });

            });

    }

}).catch(err=>{
    return res.status(500).json({
        error : err
    });
});

});

const UserController= require('../controllers/users')   ;
router.post('/',checkAuth,upload.single('userImage'),UserController.user_post);
router.patch('/:userId',(req , res, next) => {
    const id=req.params.userId ;
    res.status(200).json({
        message: "It's work for update Id :"+id
    });
});
router.delete('/:userId',(req , res, next) => {
    const id=req.params.userId ;
    res.status(200).json({
        message: "It's work for delete Id :"+id
    });
});
module.exports = router ;

