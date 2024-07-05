const {Router} =require("express");
const {getNotes, saveNotes, updateNotes, deleteNotes} =require("../controller/NotesController");
const router = Router();

router.get("/get", getNotes);
router.post("/save",saveNotes);
router.put("/update/:id",updateNotes);
router.delete("/delete/:id", deleteNotes);

module.exports = router;