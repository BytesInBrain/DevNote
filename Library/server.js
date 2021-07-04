const express = require("express"); 
const bodyParser = require("body-parser");
const {MongoClient} = require("mongodb");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.options('*', cors());
app.use(morgan('tiny'));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

//Routes
const note = require("./routes/note");
const notebook = require("./routes/notebook");
app.use("/note",note);
app.use("/notebook",notebook);


//Server
const PORT = 5001;

const mongo_uri =  "mongodb://mongodb:27017";
MongoClient.connect(mongo_uri, { useNewUrlParser: true,useUnifiedTopology: true,poolSize:10 })
.then(client => {
  const db = client.db('ClusterDuck');
  const NbCollection = db.collection('Notebooks');
  const NoteCollection = db.collection('Notes');
  app.locals.NbCollection = NbCollection;
  app.locals.NoteCollection = NoteCollection;
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