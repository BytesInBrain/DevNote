const jwt = require("jsonwebtoken");
var jwt_secret = "boombaambapbadabapboompoww";
const mongo = require("mongodb");
exports.loginUser = async(req,res,next)=>{
    let body = req.body;
    const collection = req.app.locals.collection;
    let user;
    try{
        const query = {"email": body.email };
        user = await collection.findOne(query);
        if(!user){
            return res.json({"Error":"User Not Found"});
        }
        if(user.password !== body.password){
            return res.json({"Error":"Incorrect Password"});
        }
    }catch(err){
        console.log(err);
    }
    jwt.sign({user}, jwt_secret, { expiresIn: '90000s' }, (err, token) => {
        res.json({
          token,
          username:user.username
        });
    });
}
exports.registerUser = async(req,res,next)=>{
    let body = req.body;
    const collection = req.app.locals.collection;
    let user;
    try{
        let query = {"email": body.email };
        user = await collection.findOne(query);
        if(user){
            return res.json({"Error":"User Already Exist!"});
        }
        user = await collection.findOne({"username": body.username });
        if(user){
            return res.json({"Error":"User Already Exist!"});
        }
        query = body;
        user = await collection.insertOne(query);
    }catch(err){
        console.log(err);
    }
    res.json(user.ops[0]);
}
exports.verifyUser = async(req,res,next)=>{
    let body = req.body;
    const collection = req.app.locals.collection;
    jwt.verify(body.token,jwt_secret, async(err, authData) => {
        if(err) {
            res.sendStatus(403);
            return res.json({"data":"Error"});
        } else {
            if(body.username !== authData.user.username){
                res.status(203);
                return res.json({"Error":"Username Not Valid"});
            }
            let query = {"_id": mongo.ObjectID(authData.user._id) };
            var user = await collection.findOne(query);
            if(user._id.toString() !== authData.user._id){
                res.status(203);
                return res.json({"Error":"Credentials Not Valid"});
            }
        }
        return res.json({"data":"Verified!","userId":user._id.toString()});
      });
}