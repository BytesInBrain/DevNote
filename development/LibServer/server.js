const http = require('http')
const {MongoClient} = require('mongodb')
const main = require('./main')
const PORT = process.env.PORT || 5001

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017"

MongoClient.connect(MONGO_URI, {useNewUrlParser:true,useUnifiedTopology:true})
.then(client => {
    const dba = client.db("ClusterDuck")
    const db = {
        Category : dba.collection("Category"),
        Note : dba.collection("Note"),
        Notebook : dba.collection("Notebook")
    }
    http.createServer(function(req,res){
        main(req,res,db)
    })
    .listen(PORT,console.log(`LibServer running on port ${PORT}`))
}).catch(error => console.error(error))


process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
  });
  
process.on('SIGINT', () => {
    app.locals.collection.close();
    process.exit();
});
  
