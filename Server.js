const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/NotesRoutes")
const cors = require("cors");
const moment = require('moment');
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


// const shiftChangeJob = schedule.scheduleJob('*/1 * * * *', async () => {  // Runs every minute
  const shiftChangeJob = schedule.scheduleJob('0 0 * * 0', async () => {  //run every sunday midnight
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
  // const dateUpdate = schedule.scheduleJob('*/1 * * * *', async () =>{   //1 min
  const dateUpdate = schedule.scheduleJob('0 0 * * 0', async () =>{     //every sunday midnighgt
  try{
      const notesUp =await NotesModel.find({ plant: { $exists: true },shift: { $exists: true }, date: { $exists: true } });
      for(let note of notesUp){
        if(((note.shift==='A') && (note.plant==='Minor' || note.plant==='Major')) || ((note.shift==='B') && (note.plant==='Minor' || note.plant==='Major'))){
          let newDate = moment(note.date).add(7, 'days').toDate(); // add 7 days
          await NotesModel.findByIdAndUpdate(note._id, { date: newDate });
        }
        
      }
      console.log("date updated successfully.");
    } catch (err) {
      console.error("Error updating date:", err);
    }
    
  });
  // const datetoUpdate = schedule.scheduleJob('*/1 * * * *', async () =>{  //every min
    const datetoUpdate = schedule.scheduleJob('0 0 * * *', async () =>{       //everyday midnight
    try{
      const notestoUp =await NotesModel.find({ posts: { $exists: true }, date: { $exists: true } });
      for(let note of notestoUp){
        if((note.posts==='Maintenance') || (note.posts==='Safety') || (note.posts==='CSH') || (note.posts==='Block Loading') || (note.posts==='Emergency Duty')){
          let newDate = moment(note.date).add(1, 'days').toDate(); // Add 1 day to the current date
          // console.log(`Updating note ${note._id} from ${note.date} to ${newDate}`);
          await NotesModel.findByIdAndUpdate(note._id, { date: newDate });
        }
      }
      console.log("date2 updated successfully.");
    } catch (err) {
      console.error("Error updating date2:", err);
    }
    
  });
//   module.exports.updateNotesDate = async () => {
//     try {
//         const notes = await NotesModel.find();
//         for (let note of notes) {
//             let newDate = new Date(note.date);
//             newDate.setDate(newDate.getDate() + 7); // Add 7 days to the current date
//             await NotesModel.findByIdAndUpdate(note._id, { date: newDate });
//         }
//         console.log("Dates updated successfully.");
//     } catch (err) {
//         console.error("Error updating dates:", err);
//     }
// };

  const updateNotesDateJob = schedule.scheduleJob('0 0 * * 0', updateNotesDate);
  const updateSpecificNotesDateJob = schedule.scheduleJob('0 0 * * *', updateSpecificNotesDate); // Runs every day at midnight

app.listen(PORT,()=> console.log(`Listening at ${PORT}...`));
