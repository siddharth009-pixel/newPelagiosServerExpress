
const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {signUp, signIn,signOut, updateProfile}=require('../controller/user')
const {requireSignIn} =require('../common-middleware')
const User=require('../models/user')
const { validateSignupRequest,validatedRequest,validateSigninRequest } = require('../validators/user')


router.post('/signup',validateSignupRequest,validatedRequest,signUp);

router.post('/updateprofile',requireSignIn,updateProfile);

router.post('/signin',validateSigninRequest,validatedRequest,signIn);

router.post('/signout',requireSignIn,signOut);

router.post('/profile',requireSignIn,(req,res)=>{
    return res.status(200).send('you are in profile')
})

module.exports= router;