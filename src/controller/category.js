const Category = require('../models/category')
const slugify=require('slugify')
const shortid=require('shortid');
const { convertToBase64 } = require('../helpers/base64convertor');

function sortCategories(categories,parentId=null){

    let categoryList=[]
    let category;
    if(parentId==null){
        category=categories.filter( cat => cat.parentId==undefined)
    }else{
        category=categories.filter( cat => cat.parentId==parentId)
    }

    for(let cate of category){
        categoryList.push({
            _id:cate._id,
            name:cate.name,
            slug:cate.slug,
            type:cate.type,
            parentId:cate.parentId,
            children:sortCategories(categories,cate._id)
        })
    }

    return categoryList;
}

exports.createCategory=(req,res)=>{

    const catObject={
        name:req.body.name,
        slug:`${slugify(req.body.name)}-${shortid.generate()}`
    }

    if(req.file){
        catObject.categoryImage=[{
            img:`${process.env.API + '/public/' + req.file.filename}`
        }]
    }
    
    
    // if(req.files){    
    //     let pictures=convertToBase64(req.files)
    //     catObject.categoryImage=pictures
    // }

    if(req.body.parentId){
        catObject.parentId=req.body.parentId
    }

    const cat=new Category(catObject)
    cat.save((err,category)=>{
        if(err){ return res.status(400).json(err)}
        if(category) {
            return res.status(201).json({category})
        }})
}

exports.getCategories=async (req,res)=>{

    await Category.find({})
        .then((category)=>{
            const token=req.headers.authorization.split(' ')[1];
            const categoryList=sortCategories(category);
            res.status(200).send(req.user)
        })
        .catch((err)=>{
            res.send(err);
        })
}

exports.updateCategory=async(req,res)=>{
    const {_id,name,parentId,type}=req.body;
    updatedCategories=[];
    if(name instanceof Array){
        for(let i=0;i<name.length;i++){
            let category={
                name:name[i],
                type:type[i]
            }
            if(parentId[i] !==""){
                category.parentId=parentId[i]
            }else{
                category.parentId=null
            }
            const updatedCategory=await Category.findOneAndUpdate({_id:_id[i]},category,{new:true})
            updatedCategories.push(updatedCategory)
        }
        return res.status(201).send({updatedCategories})        
    }else{
        let category={
            name,
            type
        }
        
        if(parentId !==""){
            category.parentId=parentId
        }else{
            category.parentId=undefined
        }
        const updatedCategory=await Category.findOneAndUpdate({_id:_id},category,{new:true})
        return res.status(201).send({updatedCategory})
    }
}

exports.deleteCategory=async(req,res)=>{
    const deletedCategories=[]
    const {ids}= req.body.payload;
    for(let i=0;i<ids.length;i++){
        const deletedCat=await Category.findOneAndDelete({_id:ids[i]})
        deletedCategories.push(deletedCat)
    }
    return res.status(200).send({message:"delete categories done"})
}


// (err,categories)=>{
//     if(err) return res.status(400).send(err)
//     if(categories) return res.status(200).send(categories)
// }

