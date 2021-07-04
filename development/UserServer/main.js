const {handleLogin,handleRegister,handleVerify} = require('./functions')
function main(req,res,db){
    var uri = new URL(req.url,'https://clusterduck.in/')
    //Manage Auth Token
    // var authToken = req.headers.authorization
    // if(authToken == undefined || authToken == null){
    //     res.end("No auth header found")
    //     return 
    // }
    // authToken = authToken.split(" ")
    // if(authToken[0] !== "Bearer" || authToken[0] == null){
    //     res.end("Only Bearer Accepted")
    //     return
    // }
    // authToken = authToken[1]
    //method  GET
    //path    /login
    res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader("Access-Control-Allow-Methods", "*")
	res.setHeader("Access-Control-Allow-Headers", "*")
	res.setHeader("Access-Control-Expose-Headers", "*")
    if(req.method === "OPTIONS"){
        return res.end("OK")
    }
    if(req.method === "GET" && uri.pathname === "/auth/login"){
        handleLogin(req,res,db,uri.searchParams)
        return
    }
    //method  GET
    //path    /register
    if(req.method === "GET" && uri.pathname === "/auth/register"){
        handleRegister(req,res,db,uri.searchParams)
        return
    }
    //method  GET
    //path    /verify
    if(req.method === "GET" && uri.pathname === "/auth/verify"){
        handleVerify(req,res,db,uri.searchParams)
        return
    }
    res.end("Not a vaild request")
    return
}

module.exports = main