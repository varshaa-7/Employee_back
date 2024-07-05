const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/NotesRoutes")
const cors = require("cors");
const schedule = require("node-schedule");
require("dotenv").config();

const app= express();
const PORT = process.env.PORT || 5000

const NotesModel = require("./models/notesModel");
const { updateNotesDate,updateSpecificNotesDate } = require("./controller/NotesController");

//MIDDLEWARE
app.use(express.json())
app.use(cors())


mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,

})
.then(()=> console.log("MongoDB connected..."))
.catch((err)=> console.log(err))

//API ROUTES
app.use("/api", routes);


const shiftChangeJob = schedule.scheduleJob('*/1 * * * *', async () => { // Runs every minute
    try {
      const notesToUpdate = await NotesModel.find({ plant: { $exists: true }, shift: { $exists: true } });
      for (let note of notesToUpdate) {
        // const newShift = note.shift === 'A' ? 'B' : 'A';
        let newShift =note.shift;
        if(note.shift==='A'){
            newShift='B';
        }else{
            newShift='A';
        }
        
        await NotesModel.findByIdAndUpdate(note._id, { shift: newShift });
      }
      console.log("Shift updated successfully.");
    } catch (err) {
      console.error("Error updating shift:", err);
    }
  });

  const updateNotesDateJob = schedule.scheduleJob('0 0 * * 0', updateNotesDate);
  const updateSpecificNotesDateJob = schedule.scheduleJob('0 0 * * *', updateSpecificNotesDate); // Runs every day at midnight

app.listen(PORT,()=> console.log(`Listening at ${PORT}...`));
