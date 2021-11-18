
const express= require('express')
const { requireSignIn, userMiddleware, adminMiddleware } = require('../../common-middleware')
const { updateOrder, getAllOrders } = require('../../controller/admin/order')
const { addOrder, getOrders } = require('../../controller/order')
const router=express.Router()

router.post('/order/update',requireSignIn,adminMiddleware,updateOrder)
router.get('/getAllOrders',requireSignIn,adminMiddleware,getAllOrders)

module.exports=router

// const express=require('express')
// const router=express.Router()
// const {requireSignedIn, adminMiddleware}=require('../../common-middleware/index')
// const { updateOrder } = require('../../controller/admin/order')

// router.post('/order/update',requireSignedIn,adminMiddleware,updateOrder)


// module.exports=router 