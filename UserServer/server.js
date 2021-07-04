const express = require("express");
const bodyParser = require("body-parser");
const {MongoClient} = require("mongodb");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const auth = require("./auth");
app.use("/auth",auth);



const PORT = 5000;

const mongo_uri =  "mongodb://mongodb:27017";
MongoClient.connect(mongo_uri, { useNewUrlParser: true,useUnifiedTopology: true,poolSize:10 })
.then(client => {
  const db = client.db('ClusterDuck');
  const collection = db.collection('User');
  app.locals.collection = collection;
  app.listen(PORT,
    console.log(
      `Server running on port ${PORT}`
    )
  );
}).catch(error => console.error(error));

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
});

process.on('SIGINT', () => {
  app.locals.collection.close();
  process.exit();
});


