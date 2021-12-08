const express=require('express')
const router=express.Router()
const { requireSignIn, adminMiddleware } = require('../common-middleware')
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controller/category')
const multer=require('multer')
const path=require('path')
const shortid=require('shortid')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(path.dirname(__dirname),'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname)
    }
})

const upload=multer({storage})


router.post('/category/create',requireSignIn,adminMiddleware,upload.single('categoryImage'),createCategory)

router.get('/category/getcategory',getCategories)

router.post('/category/update',upload.single('categoryImage'),updateCategory)

router.post('/category/delete',deleteCategory)


module.exports=router