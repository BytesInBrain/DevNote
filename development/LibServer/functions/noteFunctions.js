const mongo = require("mongodb")
async function addNote(req,res,db,data){
    let Note = db.Note
    let Notebook = db.Notebook
    let add = {}
    add.title = data.body.title
    add.description = data.body.description
    add.content = "Enjoy Writing Notes!!"
    add.createdAt = new Date()
    add.updatedAt = new Date()
    add.userId = mongo.ObjectID(data.userId)
    add.notebookId = mongo.ObjectID(data.params.get('notebookId'))
    try {
        let result = await Note.insertOne(add)
        let query = {
            _id: add.notebookId,
            userId: add.userId
        }
        const update = {
            $push: {
                notes: mongo.ObjectID(result.ops[0]._id)
            }
        }
        const result1 = await Notebook.updateOne(query, update);
        return res.end(JSON.stringify({"data":result1.result.n ? "Done!!":"Nope"}))
    } catch (err) {
        console.log(err);
    }
    return res.end(JSON.stringify({"Error":"IDK what happened!"}))
}
async function updateNote(req,res,db,data){
    let Note = db.Note
    let update = {}
    if(data.body.description == null && data.body.title == null && data.body.content  == null){
        return res.end(JSON.stringify({"Error":"Nothing To update"}))
    }else{
        update = {$set:{
            updatedAt:new Date(),
            title:data.body.title,
            description:data.body.description,
            content:data.body.content
        }}
    }
    const query = {
        _id : mongo.ObjectID(data.params.get('noteId')),
        userId : mongo.ObjectID(data.userId)
    }
    try{
        console.log()
        const result = await Note.updateOne(query,update)
        return res.end(JSON.stringify({"data":result.result.n ? "Done!!":"Nope"}))
    }catch(err){
        console.log(err)
    }
    return res.end(JSON.stringify({"Error":"IDK what happened!"}))
}
async function deleteNote(req,res,db,data){
    let Note = db.Note;
    let Notebook = db.Notebook;
    let noteId = data.params.get('noteId')
    var query1 = {
        "userId":mongo.ObjectID(data.userId),
        "_id":mongo.ObjectID(data.params.get('notebookId'))
    }
    var update = {
        $pull :{
            notes: mongo.ObjectID(noteId)
        }
    }
    var query = {
        "userId":mongo.ObjectID(data.userId),
        "_id":mongo.ObjectID(noteId)
    }
    try{
        const rc0 = await Notebook.updateOne(query1,update)
        console.log(rc0.result)
        const rc2 =  await Note.deleteOne(query)
        return res.end(JSON.stringify({"data":rc2.result.n ? "Done":"Nope"}))
    }catch(err){
        console.log(err)
    }
    return res.end(JSON.stringify({"Error":"IDK what happened!"}))
}

async function getNote(req,res,db,data){
    let query = {
        userId : mongo.ObjectID(data.userId),
        _id : mongo.ObjectID(data.params.get("noteId"))
    }
    let Note = db.Note
    try{
        let result = await Note.findOne(query)
        if(result == null){
            return res.end(JSON.stringify({"Error":"Not Found!!"}))
        }
        return res.end(JSON.stringify({"data":result}))
    }catch(err){
        console.log(err)
    }
    return res.end(JSON.stringify({"Error":"IDK what happened!"}))
}

async function getNotes(req,res,db,data){
    let query = {
        userId : mongo.ObjectID(data.userId),
        notebookId : mongo.ObjectID(data.params.get("notebookId"))
    }
    let Note = db.Note
    try{
        let result = await Note.find(query).toArray();
        if(result == null){
            return res.end(JSON.stringify({"Error":"Not Found!!"}))
        }
        return res.end(JSON.stringify({"data":result}))
    }catch(err){
        console.log(err)
    }
    return res.end(JSON.stringify({"Error":"IDK what happened!"}))
}
module.exports = {
    addNote,
    updateNote,
    deleteNote,
    getNote,
    getNotes
}


