const axios = require("axios");

exports.authorize = async(req,res,next)=>{
    console.log("auth-start")
    const authHeader = req.headers.authorization.split(" ")[1];
    if(!authHeader){
        res.status(203);
        return res.json({"Error":"Invalid Auth Token"});
    }
    const username = req.params.username;
    let data = {
        "token":authHeader,
        "username":username
    }
    await axios.post('http://172.18.0.3:5000/auth/verify', data)
      .then((resp)=>{
        if(resp.status !== 200 && resp.data.data !== "Verified!"){
          res.status(203);
          return res.json({"Error":"Authorization Failed"});
        }
        req.userId = resp.data.userId;
      })
      .catch((error)=>{
        console.log(error);
      });
      console.log("auth-end")
      next();
}