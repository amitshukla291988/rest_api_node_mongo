

const User = require('../models/user');
const mongoose = require('mongoose');

exports.user_post = (req , res, next) => {
console.log(req.file);
  const user = new User({
        _id: new mongoose.Types.ObjectId(),
         name: req.body.name,
         userImage: req.file.path
    });
    user.save()
    .then(result => {
        console.log(result);
    }).catch(err => console.log(err));
    res.status(200).json({
        message: "It's work for post data ",
        data:user

    });
}
