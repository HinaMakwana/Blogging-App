const mongoose = require('mongoose');

const Category = require('../models/category');

exports.add_category = (req,res,next) => {
    let doc = { name } = req.body;
    Category.find({name : doc.name}).exec()
    .then(result => {
        if(result.length >= 1){
            res.status(404).json({
                message : 'Blog title is already exist'
            });
        } else {
            const category = new Category({
                _id : new mongoose.Types.ObjectId(),
                name : doc.name
            });
            category.save()
            .then(result => {
                console.log(result);
                res.status(200).json(({
                    message : 'Created category succesfully',
                    createdCategory : {
                        name : result.name,
                        id : result._id,
                        request : {
                            type : 'GET',
                            url : 'http://localhost:3000/category',
                            description : 'Get all categories'
                        }
                    }
                }))
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error : err
                });
            });
        }
    })
    
}
 
exports.get_all_category = (req,res,next) => {
    Category.find()
    .exec()
    .then( doc => {
        const result = {
            count : doc.length,
            category : doc.map(docs => {
                return {
                    name : docs.name,
                    _id : docs._id,
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3000/category' + docs._id
                    }
                }
            })
        };
        res.status(200).json(result);
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
}

exports.edit_category = (req,res,next) => {
    const id = req.params.categoryId;
    Category.findByIdAndUpdate(id, { $set : req.body })
    .then(result => {
        if(result.name === req.body.name){
            res.status(200).json({
                message: 'category is already updated'
            })
        } else {
            res.status(200).json({
                message : 'Update category',
                request : {
                    type : 'GET',
                    url : 'http://localhost:3000/category' + id
                }
            })
        }
        
    })
    .catch(err => {
        res.status(500).json({ error : err})
    })
}

exports.delete_category = (req,res,next) => {
    const id = req.params.categoryId;
    Category.findByIdAndRemove({ _id :id})
    .exec()
    .then(result => {
        if(result) {
            res.status(200).json({
                message : 'Category deleted',
                Deleted_data : result,
                request :{
                    type : 'POST',
                    url : 'http://localhost:3000/category',
                    body : { name : 'String'}
                }
            });
        } else {
            res.status(404).json({
                message : 'Category not found'
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
}