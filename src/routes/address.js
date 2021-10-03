const express=require('express')
const { requireSignIn, userMiddleware } = require('../common-middleware')
const { addAddress, getAddress, deleteAddress } = require('../controller/address')
const router=express.Router()


router.post('/user/address/create',requireSignIn,userMiddleware,addAddress)
router.post('/user/address/delete',requireSignIn,userMiddleware,deleteAddress)
router.get('/user/address/getAddress',requireSignIn,userMiddleware,getAddress)

module.exports=router