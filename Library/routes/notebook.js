const router = require("express").Router();
const {getNotebook,postNotebook,deleteNotebook,updateNotebook,getAllNotebooks} = 
require("../controllers/notebook");
const {authorize} = require("../auth");

router
    .route("/:username")
    .get(authorize,getNotebook)
    .post(authorize,postNotebook)
    .put(authorize,updateNotebook)
    .delete(authorize,deleteNotebook);

router
    .route("/all/:username")
    .get(authorize,getAllNotebooks);


module.exports = router;
