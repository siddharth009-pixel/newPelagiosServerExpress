const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String
    },
    categoryImage: [{
        img: { type: String }
    }],
    parentId: {
        type: String
    }
}, { timestamps: true })

const Category = mongoose.model('Category', categorySchema);

module.exports = Category