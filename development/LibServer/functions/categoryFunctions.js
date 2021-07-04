const mongo = require("mongodb")
async function addCategory(req,res,db,data){
    let add = {}
    add.name = data.body.name
    add.createdAt = new Date()
    add.updatedAt = new Date()
    add.notebooks = []
    add.userId = mongo.ObjectID(data.userId)
    let Category = db.Category
    try{
        let query = {"userId":add.userId}
        const rc1 = await Category.find(query).toArray();
        for(x in rc1){
            if(add.name == rc1[x].name){
                return res.end(JSON.stringify({"Error":"Category Already Exist!!"}))
            }
        }
        const result = await Category.insertOne(add);
        if(!result){
            res.statusCode = 501
            return res.end(JSON.stringify({"Error":"Server Error"}))
        }
        return res.end(JSON.stringify({"data":{"insertedId":result.insertedId}}))
    }catch(err){
        console.log(err);
    }
    return res.end(JSON.stringify({"Error":"IDK what happened!"}))
}

async function removeCategory(req,res,db,data){
    let Category = db.Category;
    var query = {
        "userId":mongo.ObjectID(data.userId),
        "_id":mongo.ObjectID(data.params.get('categoryId'))
    }
    try{
        const rc1 = await Category.findOne(query)
        if(rc1 == null){
            return res.end(JSON.stringify({"Error":"Not Found!!"}))
        }
        if(rc1.notebooks.length != 0){
            return res.end(JSON.stringify({"Error":"Notebooks Exist!!"}))
        }
        const rc2 =  await Category.deleteOne(query)
        return res.end(JSON.stringify({"data":rc2.result.n ? "Done":"Nope"}))
    }catch(err){
        console.log(err)
    }
    return res.end(JSON.stringify({"Error":"IDK what happened!"}))
}

async function getCategory(req,res,db,data){
    let Category = db.Category
    try{
        let query = {"userId":mongo.ObjectID(data.userId)}
        const rc1 = await Category.find(query).toArray();
        if(rc1.length == 0){
            return res.end(JSON.stringify({"Error":"No Category Found !!"}))
        }
        return res.end(JSON.stringify(rc1))
    }catch(err){
        console.log(err)
    }
    return res.end(JSON.stringify({"Error":"IDK what happened!"}))
}
module.exports = {
    addCategory,
    removeCategory,
    getCategory
}