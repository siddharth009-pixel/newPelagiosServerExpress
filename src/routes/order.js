const express= require('express')
const { requireSignIn, userMiddleware } = require('../common-middleware')
const { addOrder, getOrders, addInstantOrder } = require('../controller/order')
const router=express.Router()

router.post('/addOrder',requireSignIn,userMiddleware,addOrder)
router.post('/addInstantOrder',requireSignIn,userMiddleware,addInstantOrder)
router.get('/getOrders',requireSignIn,userMiddleware,getOrders)

module.exports=router