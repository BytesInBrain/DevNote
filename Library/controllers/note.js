const mongo = require("mongodb");
exports.getNote = async(req,res,next)=>{
    let body = req.body;
    let query = {"_id":mongo.ObjectID(body.noteId)}
    const collection = req.app.locals.NoteCollection;
    try{
        const result = await collection.findOne(query);
        if(!result){
            res.status(501);
            return res.json({"data":"Server Error"});
        }
        if(result.userId != req.userId){
            res.status(203);
            return res.json({"data":"Unauthorized!"});
        }
        return res.json({"data":result});
    }catch(err){
        console.log(err);
    }
}

exports.postNote = async(req,res,next)=>{
    console.log("note-start");
    let body  = req.body;
    body.createdAt = new Date();
    body.updatedAt = new Date();
    body.content = "Enjoy Writing Notes!";
    body.notebookId = mongo.ObjectID(body.notebookId);
    body.userId = mongo.ObjectID(req.userId);
    console.log(body);
    const collection = req.app.locals.NoteCollection;
    console.log("note-start");
    try{
        const result = await collection.insertOne(body);
        if(!result){
            res.status(501);
            return res.json({"data":"Server Error"});
        }
        return res.json({"data":result.ops[0]});
    }catch(err){
        console.log(err);
    }
}

exports.deleteNote = async(req,res,next)=>{

}

exports.updateNote = async(req,res,next)=>{
    let body = req.body;
    let update;
    if(body.title){
        update = {
            $set:{
                updatedAt:new Date(),
                title:body.title,
                description:body.description
            }
        }
    }else{
        update = {
            $set:{
                updatedAt:new Date(),
                content:body.content,
            }
        }
    }
    let query = {"_id":mongo.ObjectID(body.noteId)}
    const collection = req.app.locals.NoteCollection;
    try{
        const result = await collection.updateOne(query,update);
        if(!result){
            res.status(501);
            return res.json({"data":"Server Error"});
        }
        return res.json({"data":"Updated!"});
    }catch(err){
        console.log(err);
    }
    
}   

exports.getAllNotes = async(req,res,next)=>{
    let body = req.body;
    let userId = req.userId;
    console.log(body);
    let query = {
        "notebookId":mongo.ObjectID(body.notebookId),
        "userId":mongo.ObjectID(userId)
    }
    const collection = req.app.locals.NoteCollection;
    try{
        const result = await collection.find(query).toArray();
        if(!result){
         res.status(501);
         return res.json({"data":"Server Error"});
        }else if(result == null){
            res.status(201);
            return res.json({"data":"Not Found!"});
        }
        console.log(result)
        res.json(result);
     }catch(err){
         console.log(err);
     }
}

