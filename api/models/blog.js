const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String
    },
    slug: { type: String },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
    description: { type : String },
    publish_date: { type: Date , required: true },
    blogImage: { type : String },
    created_by : { type : String },
    updated_by : { type : String },
    updated_at : { type : Date },
    deleted_by : { type: String },
    deleted_at : { type : Date },
    isDeleted : { type : Boolean , default : false }
}, { versionKey : false})

module.exports = mongoose.model('Blog',blogSchema);