const {check}=require('express-validator')
const { validationResult } = require('express-validator')

exports.validatedRequest=(req,res,next)=>{
const errors=validationResult(req)
if(errors.array().length>0){
    return res.status(404).json({error:errors.array()[0].msg})
}
next();
}


exports.validateSignupRequest=[
    check('email')
    .isEmail()
    .withMessage('valid email required')
]

exports.validateSigninRequest=[
    check('email')
    .isEmail()
    .withMessage('valid email required'),
    check('password')
    .isLength({min:6})
    .withMessage('password required')
]



// exports.validateSignupRequest=[
//     check('firstname')
//     .notEmpty()
//     .withMessage('FirstName is required'),
//     check('lastname')
//     .notEmpty()
//     .withMessage('lastname is required'),
//     check('email')
//     .isEmail()
//     .withMessage('valid email required'),
//     check('password')
//     .isLength({min:6})
//     .withMessage('password required')
// ]