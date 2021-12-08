const express=require('express')
const router=express.Router()
const { initialData, adminInitialData } = require('../../controller/admin/initialData')


router.post('/initialData',initialData)

router.post('/admininitialData',adminInitialData)


module.exports=router