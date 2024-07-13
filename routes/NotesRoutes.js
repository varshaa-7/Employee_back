const {Router} =require("express");
const {getNotes, saveNotes, updateNotes, deleteNotes,updateSpecificNotesDate,updateLeave} =require("../controller/NotesController");
const router = Router();

router.get("/get", getNotes);
router.post("/save",saveNotes);
router.put("/update/:id",updateNotes);
router.delete("/delete/:id", deleteNotes);
router.put("/updateSpecificNotesDate", updateSpecificNotesDate);
router.put("/leave/:id",updateLeave)

module.exports = router;