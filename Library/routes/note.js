const router = require("express").Router();
const {getNote,postNote,deleteNote,updateNote,getAllNotes}
= require("../controllers/note");
const {authorize} = require("../auth");

router
    .route("/:username/id")
    .post(authorize,getNote)
router
    .route("/:username")
    .post(authorize,postNote)
    .put(authorize,updateNote)
    .delete(authorize,deleteNote);
router
    .route("/all/:username")
    .post(authorize,getAllNotes);
module.exports = router;
