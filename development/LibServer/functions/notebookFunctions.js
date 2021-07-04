const mongo = require('mongodb')
async function addNotebook(req, res, db, data) {
    let Notebook = db.Notebook
    let Category = db.Category
    let add = {}
    add.title = data.body.title
    add.description = data.body.description
    add.createdAt = new Date()
    add.updatedAt = new Date()
    add.notes = []
    add.userId = mongo.ObjectID(data.userId)
    add.categoryId = mongo.ObjectID(data.params.get('categoryId'))
    try {
        let result = await Notebook.insertOne(add)
        let query = {
            _id: add.categoryId,
            userId: add.userId
        }
        const update = {
            $push: {
                notebooks: mongo.ObjectID(result.ops[0]._id)
            }
        }
        const result1 = await Category.updateOne(query, update);
        return res.end(JSON.stringify({"data":result1.result.n ? "Done!!":"Nope"}))
    } catch (err) {
        console.log(err);
    }
    return res.end(JSON.stringify({"Error":"IDK what happened!"}))
}
async function updateNotebook(req, res, db, data) {
    let Notebook = db.Notebook
    let update = {}
    if(data.body.title == null){
        update = {
            updatedAt:new Date(),
            description:data.body.description
        }
    }else if(data.body.description == null){
        update = {
            updatedAt:new Date(),
            title:data.body.title,
        }
    }else if(data.body.description == null && data.body.title == null){
        return res.end(JSON.stringify({"Error":"Nothing To update"}))
    }else{
        update = {
            updatedAt:new Date(),
            title:data.body.title,
            description:data.body.description
        }
    }
    const query = {
        _id : mongo.ObjectID(data.params.get('notebookId')),
        userId : mongo.ObjectID(data.userId)
    }
    try{
        const result = await Notebook.updateOne(query,update)
        return res.end(JSON.stringify({"data":result.result.n ? "Done!!":"Nope"}))
    }catch(err){
        console.log(err)
    }
}
async function deleteNotebook(req, res, db, data) {
    let Notebook = db.Notebook;
    let Category = db.Category;
    let notebookId = data.params.get('notebookId')
    var query1 = {
        "userId":mongo.ObjectID(data.userId),
        "_id":mongo.ObjectID(data.params.get('categoryId'))
    }
    var update = {
        $pull :{
            notebooks: mongo.ObjectID(notebookId)
        }
    }
    var query = {
        "userId":mongo.ObjectID(data.userId),
        "_id":mongo.ObjectID(notebookId)
    }
    try{
        const rc0 = await Category.updateOne(query1,update)
        console.log(rc0.result)
        const rc1 = await Notebook.findOne(query)
        if(rc1 == null){
            return res.end(JSON.stringify({"Error":"Not Found!!"}))
        }
        if(rc1.notes.length != 0){
            return res.end(JSON.stringify({"Error":"Notes Exist!!"}))
        }
        const rc2 =  await Notebook.deleteOne(query)
        return res.end(JSON.stringify({"data":rc2.result.n ? "Done":"Nope"}))
    }catch(err){
        console.log(err)
    }
    return res.end(JSON.stringify({"Error":"IDK what happened!"}))
}
async function getNotebook(req, res, db, data) {
    let query = {
        userId : mongo.ObjectID(data.userId),
        _id : mongo.ObjectID(data.params.get("notebookId"))
    }
    let Notebook = db.Notebook
    try{
        let result = await Notebook.findOne(query)
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
    addNotebook,
    updateNotebook,
    deleteNotebook,
    getNotebook
}