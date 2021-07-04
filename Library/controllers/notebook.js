const mongo = require("mongodb");
exports.getNotebook = async(req,res,next)=>{
    let body = req.body;
    const bCollection = req.app.locals.NbCollection;
    try{
        const query = {"id":mongo.ObjectID(body.notId)};
        const options = {
                  projection: {userId:0},
                };
        var notebook = await bCollection.findOne(query,options);
        if(notebook.userId.toString() !== req.userId){
            res.status(203);
            return res.json({"data":"Nope"});
        }
        return res.json(notebook);
    }catch(err){
        console.log(err);
    }
}

exports.postNotebook = async(req,res,next)=>{
    var body  = req.body;
    body.createdAt = new Date();
    body.updatedAt = new Date();
    body.notes = [];
    body.userId = mongo.ObjectID(req.userId);
    console.log(body);
    const bCollection = req.app.locals.NbCollection;
    try{
        const result = await bCollection.insertOne(body);
        if(!result){
            res.status(501);
            return res.json({"data":"Server Error"});
        }
        return res.json({"data":{"insertedId":result.insertedId}});
    }catch(err){
        console.log(err);
    }
}

exports.deleteNotebook = async(req,res,next)=>{
    
}

exports.updateNotebook = async(req,res,next)=>{

}

exports.getAllNotebooks = async(req,res,next)=>{
    const query = {"userId":mongo.ObjectID(req.userId)}
    const bCollection = req.app.locals.NbCollection;
    try{
       const result = await bCollection.find(query).toArray();
       if(!result){
        res.status(501);
        return res.json({"data":"Server Error"});
       }
    //    console.log(result)
       res.json(result);
    }catch(err){
        console.log(err);
    }
}


