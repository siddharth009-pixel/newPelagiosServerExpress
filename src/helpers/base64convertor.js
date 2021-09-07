const fs = require('fs');
const base64Img = require('base64-img');


function encode(url) {

    var data = base64Img.base64Sync(url);
    return data;
}

exports.convertToBase64 =(files)=>{

    let pictures=[];
    
    if(files.length>0){
        pictures=files.map(file =>{
            let base64Image=encode(file.path)
            fs.unlinkSync(file.path); 
            return { img:base64Image }
        })
    }

    return pictures;

}

