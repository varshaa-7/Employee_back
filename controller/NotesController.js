const NotesModel = require("../models/notesModel");

module.exports.getNotes = async (req, res) => {
    const notes = await NotesModel.find();
    res.send(notes);
};

module.exports.updateSpecificNotesDate = async (req, res) => {
    try {
        const specificPosts = ["Maintenance", "Safety", "CSH", "Block Loading", "Emergency Duty"];
        const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        const notesToUpdate = await NotesModel.find({ posts: { $in: specificPosts } });
        for (let note of notesToUpdate) {
            await NotesModel.findByIdAndUpdate(note._id, { date: todayDate });
        }
        console.log("Specific notes dates updated to today's date successfully.");
        res.send("Specific notes dates updated to today's date successfully.");
    } catch (err) {
        console.error("Error updating specific notes dates:", err);
        res.status(500).send("Error updating specific notes dates.");
    }
};


module.exports.saveNotes = (req, res) => {
    const { notes, posts, plant, shift, status, date , leaveReason} = req.body;

    NotesModel.create({ notes, posts, plant, shift, status, date, leaveReason })
        .then((data) => {
            console.log("Saved Successfully...");
            res.status(201).send(data);
        })
        .catch((err) => {
            console.log(err)
            res.send({ error: err, msg: "Something went wrong!" });
        });
};

module.exports.updateNotes = (req, res) => {
    const { id } = req.params;
    const { notes, status } = req.body;

    NotesModel.findByIdAndUpdate(id, { notes, status })
        .then(() => {
            res.send("Updated Successfully...");
        })
        .catch((err) => {
            console.log(err)
            res.send({ error: err, msg: "Something went wrong!" });
        });
};
module.exports.updateLeave = (req, res) => {
    const { id } = req.params;
    const { notes, status,leaveReason } = req.body;

    NotesModel.findByIdAndUpdate(id, { notes, status,leaveReason })
        .then(() => {
            res.send("Reason added Successfully...");
        })
        .catch((err) => {
            console.log(err)
            res.send({ error: err, msg: "Something went wrong!" });
        });
};

module.exports.deleteNotes = (req, res) => {
    const { id } = req.params;

    NotesModel.findByIdAndDelete(id)
        .then(() => {
            res.send("Deleted Successfully...");
        })
        .catch((err) => {
            console.log(err)
            res.send({ error: err, msg: "Something went wrong!" });
        });
};

module.exports.updateNotesDate = async () => {
    try {
        const notes = await NotesModel.find();
        for (let note of notes) {
            let newDate = new Date(note.date);
            newDate.setDate(newDate.getDate() + 7); // Add 7 days to the current date
            await NotesModel.findByIdAndUpdate(note._id, { date: newDate });
        }
        console.log("Dates updated successfully.");
    } catch (err) {
        console.error("Error updating dates:", err);
    }
};