const slugify = require("slugify");
const Category = require("../models/category");
const Product = require("../models/product")
const fs = require('fs');
const base64Img = require('base64-img');
const { convertToBase64 } = require("../helpers/base64convertor");


exports.createProduct=(req,res)=>{
    
    const {name,description,offer,quantity,category,price}=req.body;

    // let productPictures=[] 
    // if(req.files.length>0){
    //     productPictures=req.files.map(file=>{
    //         return { img : file.filename }
    //     })
    // }

    

    let pictures=convertToBase64(req.files)

    
    // return res.status(200).send('asdfgh')
    const product=new Product({
        name,
        slug:slugify(name),
        price,
        description,
        offer,
        productPictures:pictures,
        quantity,
        category,
        createdBy:req.user._id
    })
    
    product.save((err,product)=>{
        if(err){
            return res.status(400).send({error:err})
        }
        if(product){
            return res.status(201).send({product:product})
        }
    })

}


exports.getProductsBySlug=(req,res)=>{
    const {slug}=req.params;
    Category.findOne({slug:slug})
    .select('_id')
    .exec((err,cat)=>{
        if(err){
            return res.status(400).send({err})
        }
            if(cat){
            Product.find({category:cat._id})
            .exec((err,products)=>{
                if(err){
                    return res.status(400).send({err});
                }
                return res.status(200).send({
                    products,
                    productsByPrice:{
                        under5k:products.filter((products)=>products.price>=0 && products.price<=5000),
                        under10k:products.filter((products)=>products.price>5000 && products.price<=10000),
                        under15k:products.filter((products)=>products.price>10000 && products.price<=15000),
                        under20k:products.filter((products)=>products.price>15000 && products.price<=20000),
                        under50k:products.filter((products)=>products.price>20000 && products.price<=50000),
                        under100k:products.filter((products)=>products.price>50000 && products.price<=100000),
                        above100k:products.filter((products)=>products.price>100000)
                    }
                })
            })}

    })
    // const slug=req.params.
}

exports.getProductDetailsById=async(req,res)=>{
    const {productId}=req.params

    if(productId){
        Product.findOne({_id:productId})
        .exec((error,product)=>{
            if(error){
                return res.status(400).send({error:error})
            }
            if(product){
                return res.status(200).send({product})
            }

        })
    }else{
        return res.status(200).send({error:"params required"})
    }

}


exports.getAllProducts=async(req,res)=>{
    Product.find({})
    .exec((error,products)=>{
        if(error){
            return res.status(400).send({error:error})
        }
        if(products){
            return res.status(200).send({products:products})
        }
    })

}

exports.deleteProduct=async(req,res)=>{
    const {productId}= req.body.payload
    console.log(productId)
    Product.findOneAndDelete({_id:productId})
    .exec((error,products)=>{
        if(error){
            return res.status(400).send({error:error})
        }
        if(products){
            return res.status(200).send({products:products})
        }
    })

}
