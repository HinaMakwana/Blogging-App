const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');

exports.admin_login = (req,res,next) => {
    Admin.find({ email: req.body.email })
    .exec()
    .then(admin =>{
        if(admin.length < 1){
            return res.status(404),json({
                message: 'Admin auth failed'
            });
        }
        bcrypt.compare(req.body.password, admin[0].password, (err,result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Admin auth failed'
                });
            }
            if (result){
                const token = jwt.sign(
                    { 
                    email: admin[0].email,
                    adminId: admin[0]._id
                    },
                    process.env.JWT_KEY, 
                    {
                        expiresIn : "8h"
                    }
                );
                Admin.findOneAndUpdate(req.body.email, { $set : {token : token} }).exec();
                return res.status(200).json({
                    message: 'Admin auth successful',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Admin auth failed'
            });
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
}

exports.admin_logout = (req,res, next) => {
    const admin = req.adminData.adminId;
    console.log(req.adminData)
    Admin.findByIdAndUpdate( admin , { $set : { "token" : null}}).exec();
    res.status(200).json({
        message : 'logout successfully'
    })
}


