// let multer=require('multer')

// function uploadfile(req,res,option){
//     let limit=(option && option.limit) ? option.limit:2*1000*1000;
//     let type=(option && option.type)? option.type:[]
//     return new Promise((res,rej)=>{
//         if(!option.fileName){
//             return rej("qwertyuiop")
//         }
//         let upload= multer({limit});
//         let mul=upload.fields([{name:option.fileName,maxCount:2}]);
//         mul(req,res,(err,data)=>{
//             if(err){
//                 return rej(err)
//             }
//             return res({data:true})
//         })
//     })
// }
