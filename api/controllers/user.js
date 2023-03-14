const Blog = require('../models/blog');

exports.latest_blog = (req,res,next) => {
    Blog.find({isDeleted : false }).sort({publish_date : -1})
    .populate('category', 'name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count : docs.length,
            blogs : docs.map(doc => {
                return {
                    blog : doc
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

exports.search_title = (req,res,next) => {
    const regex = new RegExp(req.params.title , 'i' );
    Blog.find( { title : regex , isDeleted : false })
    .then( result => {
        res.status(200).json(result)
    })
}

exports.search_through_query = (req,res,next) => {
    let title = req.query.search;
    if(title){
        const regex = new RegExp(title , 'i' );
        Blog.find({ title : regex, isDeleted : false }).exec()
        .then( result => {
            if(result.length > 0) {
                res.status(200).json(result)
            } else {
                res.status(404).json({
                    message : 'No blog found'
                })
            } 
        })
    } else {
        res.status(404).json({
            message : 'Blog not found'
        })
    }
}

exports.search_slug = (req,res,next) => {
    slug = req.params.slug;
    console.log(slug);
    Blog.find({slug : slug , isDeleted : false})
    .populate('category')
    .exec()
    .then(result => {
        if(result.length > 0) {
            res.status(200).json({
                result:result
             });
        } else  {
            res.status(404).json({
                message : 'Blog not found'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
}

exports.get_blog = (req,res,next) => {
    const title = req.params.title;
    Blog.find({ title : title, isDeleted : false})
    .exec()
    .then( result => {
        if (result.length > 0) {
            res.status(200).json({
                Blog : result
            });
        } else {
            res.status(404).json({
                message : 'Blog not found'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    })
}