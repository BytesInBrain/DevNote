const jwt = require('jsonwebtoken')
const jwt_secret = process.env.JWT_SECRET || "boombaambapbadabapboompoww"
const mongo = require("mongodb")


async function handleVerify(req,res,db,data){
    console.log("Got verifiy req")
    let body = {
        token : data.get('token'),
        username : data.get('username')
    };
    if(body.token == null || body.username == null){
        return res.end(JSON.stringify({"Error" : "Credentials Invalid"}))
    }
    const collection = db.User;
    jwt.verify(body.token,jwt_secret, async(err, authData) => {
        if(err) {
            res.statusCode = 403
            return res.end(JSON.stringify({"data":"Error"}));
        } else {
            if(body.username !== authData.user.username){
                res.statusCode = 203
                return res.end(JSON.stringify({"Error":"Username Not Valid"}));
            }
            let query = {"_id": mongo.ObjectID(authData.user._id) };
            var user = await collection.findOne(query);
            if(user._id.toString() !== authData.user._id){
                res.statusCode = 203
                return res.end(JSON.stringify({"Error":"Credentials Not Valid"}));
            }
        }
        return res.end(JSON.stringify({"data":"Verified!","userId":user._id.toString()}));
      });
}
async function handleRegister(req,res,db,data){
    let body = {
        email : data.get('email'),
        password : data.get('password'),
        username : data.get('username')
    };
    if(body.email == null || body.password == null || body.username == null){
        return res.end(JSON.stringify({"Error" : "Credentials Invalid"}))
    }
    const collection = db.User;
    let user;
    try{
        let query = {"email": body.email };
        user = await collection.findOne(query);
        if(user){
            return res.end(JSON.stringify({"Error":"User Already Exist!"}));
        }
        user = await collection.findOne({"username": body.username });
        if(user){
            return res.end(JSON.stringify({"Error":"User Already Exist!"}));
        }
        query = body;
        user = await collection.insertOne(query);
        return res.end(JSON.stringify({data : user.ops[0]}));
    }catch(err){
        console.log(err);
    }
    return res.end(JSON.stringify({Error : "IDK What happened"}));
}

async function handleLogin(req,res,db,data){
    let body = {
        email : data.get('email'),
        password : data.get('password')
    };
    if(body.email == null || body.password == null){
        return res.end(JSON.stringify({"Error" : "Credentials Invalid"}))
    }
    const collection = db.User;
    let user;
    try{
        const query = {"email": body.email }
        user = await collection.findOne(query);
        if(!user){
            return res.end(JSON.stringify({"Error":"User Not Found"}));
        }
        if(user.password !== body.password){
            return res.end(JSON.stringify({"Error":"Incorrect Password"}));
        }
    }catch(err){
        console.log(err);
    }
    jwt.sign({user}, jwt_secret, { expiresIn: '90000s' }, (err, token) => {
        return res.end(JSON.stringify({
          token,
          username:user.username
        }));
    });
    return
}

module.exports = {
    handleLogin,
    handleVerify,
    handleRegister
}