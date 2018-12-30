const http = require('http');

const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const v = require('node-input-validator');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());




const mysqlConnection=mysql.createConnection({
            host:'localhost',
            user : 'root',
            password : 'amit',
            database: 'nodeMysql'
         });
mysqlConnection.connect((err)=>{
 if(!err)
    console.log('db connection succeded.');
 else
    console.log('db connection failed \n Error :'+JSON.stringify(err,undefined,2));

});

app.listen(3000,()=>console.log('Express server.'));

app.get('/user',(req,res)=>{
 mysqlConnection.query('select * from User',(err,rows,fields)=>{
    if(!err){
        res.send(rows);
    }else{
        res.status(401).json({
            message:'invalid user id'
        });
    }
 });
});

app.get('/user/:id',(req,res)=>{
 mysqlConnection.query('select * from User where Id=?',[req.params.id],(err,rows,fields)=>{
    if(!err && rows.length > 0){
        res.send(rows);
    }else{
         res.status(401).json({
            message:'invalid user id'
        });
    }
 });
});



app.post('/login', (req, res,next)=> {

    let validator = new v( req.body, {
        email:'required|email',
        password: 'required'
        });

    validator.check().then(function (matched) {
        if (!matched) {
            res.status(422).send(validator.errors);
        }
    });
});



