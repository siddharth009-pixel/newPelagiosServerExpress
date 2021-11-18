const express=require('express')
const router=express.Router()
const {requireSignIn, userMiddleware, adminMiddleware}=require('../common-middleware')
const { addItemToCart, getCartItems, removeCartItem } = require('../controller/cart')

router.post('/user/cart/addtocart',requireSignIn,userMiddleware,addItemToCart)
router.post('/user/cart/removecartitem',requireSignIn,userMiddleware,removeCartItem)
router.get('/user/cart/getcartitems',requireSignIn,userMiddleware,getCartItems)


module.exports=router