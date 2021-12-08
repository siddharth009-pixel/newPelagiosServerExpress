const Category = require("../../models/category");
const Order = require("../../models/order");
const Product = require("../../models/product");

exports.initialData = async (req, res) => {


    function sortCategories(categories, parentId = null) {

        let categoryList = []
        let category = [];
        if (parentId == null) {
            category = categories.filter(cat => cat.parentId == undefined)
        } else {
            category = categories.filter(cat => cat.parentId == parentId)
        }

        for (let cate of category) {
            categoryList.push({
                _id: cate._id,
                name: cate.name,
                slug: cate.slug,
                parentId: cate.parentId,
                type: cate.type,
                children: sortCategories(categories, cate._id)
            })
        }

        return categoryList;
    }
    const categories = await Category.find({}).exec()
    // const products = await Product
    //     .find({})
    //     .select('_id name price quantity description productPictures category')
    //     .populate({ path: 'category', select: '_id name' })
    //     .exec()
    // const orders = await Order.find({}).exec()
    res.status(200).send({
        categories: sortCategories(categories),
        // products,
        // orders
    })

}


exports.adminInitialData = async (req, res) => {


    function sortCategories(categories, parentId = null) {

        let categoryList = []
        let category = [];
        if (parentId == null) {
            category = categories.filter(cat => cat.parentId == undefined)
        } else {
            category = categories.filter(cat => cat.parentId == parentId)
        }

        for (let cate of category) {
            categoryList.push({
                _id: cate._id,
                name: cate.name,
                slug: cate.slug,
                parentId: cate.parentId,
                type: cate.type,
                children: sortCategories(categories, cate._id)
            })
        }

        return categoryList;
    }
    const categories = await Category.find({}).exec()
    const products = await Product
        .find({})
        .select('_id name price quantity description productPictures category')
        .populate({ path: 'category', select: '_id name' })
        .exec()
    const orders = await Order.find({}).exec()
    res.status(200).send({
        categories: sortCategories(categories),
        products,
        orders
    })

}