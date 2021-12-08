const express = require('express')
const router = express.Router()
const { requireSignIn, adminMiddleware } = require('../common-middleware')
// const { createCategory, getCategories } = require('../controller/category')
const multer = require('multer')
const path = require('path')
const shortid = require('shortid')
const { createProduct, getProductsBySlug, getProductDetailsById, getAllProducts, deleteProduct } = require('../controller/product')
const { uploadS3 } = require('../common-middleware')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

router.post('/product/create', requireSignIn, adminMiddleware, uploadS3.array('productPictures'), createProduct)
router.get('/products/:slug', getProductsBySlug)
router.get('/product/:productId', getProductDetailsById)
router.get('/products', requireSignIn,adminMiddleware, getAllProducts)
router.post('/products/delete', requireSignIn, adminMiddleware, deleteProduct)
//product update
// router.get('/category/getcategory',getCategories)


module.exports = router