const mongoose = require('mongoose');

const Blog = require('../models/blog');

const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

exports.get_all_blogs = (req,res,next) => {
    Blog.find({ isDeleted  : false})
    .populate('category', 'name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count : docs.length,
            blogs : docs.map(doc => {
                return {
                    blog : doc,
                    Description: 'For edit blog',
                    return : {
                        type : 'PATCH',
                        url : 'http://localhost:3000/blog/:blogId' 
                    },
                    Description : 'For delete blog',
                    return : {
                        type : 'DELETE',
                        url : 'http://localhost:3000/blog/:blogId' 
                    }
                }
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
}
    
exports.add_blog = (req,res,next) => {
    const admin_id =req.adminData.adminId;
    console.log(req.adminData.adminId)
    console.log(req.file);
    const date = new Date();
    let data = { title, category, description, blogImage } = req.body;
    Blog.find({title : data.title}).exec()
    .then(result => {
        if(result.length >= 1){
            res.status(404).json({
                message : 'Blog title is already exist'
            });
        } else {
            const blog = new Blog({
                _id: new mongoose.Types.ObjectId(),
                title : data.title,
                category : data.category,
                description : data.description,
                blogImage : req.file.path,
                slug : slugify(data.title),
                publish_date : date,
                created_by : admin_id
            });
            blog.save()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message : 'Created blog successfully',
                    createdBlog : {
                        blog  : result,
                        request: {
                            type : "GET",
                            url : 'http://localhost:3000/blog/' + result._id
                        }
                    }
                });
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error : err
                });
            });
        }
    })
}

exports.delete_blog = (req,res,next) => {
    const admin_id =req.adminData.adminId;
    const id = req.params.blogId;
    Blog.findByIdAndUpdate({_id : id}, { $set : { deleted_by : admin_id, deleted_at : new Date(), isDeleted: true}})
    .exec()
    .then(result => {
        if(result.isDeleted == true) {
            res.status(404).json({
                message : 'Blog not found'
            })
        } else {
            res.status(200).json({
                message : 'Blog deleted',
                id : result._id,
                title : result.title,
                deleted_by : admin_id,
                deleted_at : new Date(),
                isDeleted : true
            })
            
        }
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
}

exports.update_blog = (req,res,next) => {
    const admin_id =req.adminData.adminId;
    const id = req.params.blogId;
    const data = req.body;
    data.updated_by = admin_id;
    data.updated_at = new Date();
    Blog.findOne( { _id : id }).exec()
    .then( result => {
        if(result.isDeleted == true) {
            res.status(404).json({
                message : "Blog not found"
            })
        } else {
            Blog.find({ title : data.title , isDeleted : false}).exec()
            .then( result => {
                if(result.length >= 1){
                    res.status(409).json({
                        message : 'Blog title is exist'
                    });
                } else {
                    delete req.body.isDeleted;
                    if(result.title != data.title){
                        data.slug = slugify(data.title); 
                    }
                    Blog.findByIdAndUpdate(id, { $set : data})
                    .then( result => { 
                        res.status(200).json({
                            message: 'Blog updated successfully',
                            updated_by : admin_id,
                            updated_at : new Date()
                        });
                    })
                }
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
}
