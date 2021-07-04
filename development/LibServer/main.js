const {
    addNotebook,
    updateNotebook,
    deleteNotebook,
    getNotebook
} = require('./functions/notebookFunctions')
const {
    addNote,
    updateNote,
    deleteNote,
    getNote,
    getNotes
} = require('./functions/noteFunctions')
const {
    addCategory,
    removeCategory,
    getCategory
} = require('./functions/categoryFunctions')
const http = require('http');



async function main(req, res, db) {
    res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader("Access-Control-Allow-Methods", "*")
	res.setHeader("Access-Control-Allow-Headers", "*")
	res.setHeader("Access-Control-Expose-Headers", "*")
    if(req.method === "OPTIONS"){
        return res.end("OK")
    }
    let data = {}
    const uri = new URL(req.url, 'https://clusterduck.in/')
    data.pathname = uri.pathname
    data.params = uri.searchParams
    //Manage Auth Token
    var authToken = req.headers.authorization
    if (authToken == undefined || authToken == null) {
        res.end("No auth header found")
        return
    }
    authToken = authToken.split(" ")
    if (authToken[0] !== "Bearer" || authToken[0] == null) {
        res.end("Only Bearer Accepted")
        return
    }
    authToken = authToken[1]
    //Capture body
    if(req.method == "POST" || req.method == "PUT"){
        let fuldata = '';
        req.on('data', chunk => {
            fuldata += chunk;
        })
        req.on('end', () => {
            data.body = JSON.parse(fuldata)
        })
    }
   


    const username = data.params.get('username')
    if (username == null) {
        return res.end(JSON.stringify({
            "Error": "Invalid Params"
        }))
    }

    //varify user
    await http.get(`http://172.19.0.3:5000/auth/verify?username=${username}&token=${authToken}`, (resp) => {
        let bit = '';
        if(resp.statusCode !== 200){
            res.statusCode = 203
            return res.end(JSON.stringify({"Error":"Authorization Failed"}));
        }
        resp.on('data', (chunk) => {
            bit += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            bit = JSON.parse(bit)
            if(bit.data !== "Verified!"){
                res.statusCode = 203
                return res.end(JSON.stringify({"Error":"Authorization Failed"}));
            }
            data.userId = bit.userId
            return forward(req,res,db,data)
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
    return
}



function forward(req,res,db,data){
    //Notebook Routes
    if (req.method === "GET" && data.pathname === "/lib/notebook") {
        return getNotebook(req, res, db, data)
    }
    if (req.method === "POST" && data.pathname === "/lib/notebook") {
        return addNotebook(req, res, db, data)
    }
    if (req.method === "PUT" && data.pathname === "/lib/notebook") {
        return updateNotebook(req, res, db , data)
    }
    if (req.method === "DELETE" && data.pathname === "/lib/notebook") {
        return deleteNotebook(req, res,db, data)
    }
    //Note Routes
    if (req.method === "GET" && data.pathname === "/lib/note") {
        if (data.params.get('list')) {
            return getNotes(req, res, db, data)
        } else {
            return getNote(req, res, db, data)
        }
    }
    if (req.method === "POST" && data.pathname === "/lib/note") {
        return addNote(req, res, db, data)
    }
    if (req.method === "PUT" && data.pathname === "/lib/note") {
        return updateNote(req, res, db, data)
    }
    if (req.method === "DELETE" && data.pathname === "/lib/note") {
        return deleteNote(req, res, db, data)
    }

    //Category Routes
    if (req.method === "GET" && data.pathname === "/lib/category") {
        return getCategory(req, res, db, data)
    }
    if (req.method === "POST" && data.pathname === "/lib/category") {
        return addCategory(req, res, db, data)
    }
    if (req.method === "DELETE" && data.pathname === "/lib/category") {
        return removeCategory(req, res, db, data)
    }
}


module.exports = main