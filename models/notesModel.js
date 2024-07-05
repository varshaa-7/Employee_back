const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
    notes:{
        type:String,
        required: true,
    },
    posts:{
        type:String,
        required:true,
    },
    plant: {
        type: String,
        required: false,
    },
    shift: {
        type: String,
        enum: ['A', 'B',''],
        required: false,
    },
    status: {
        type: String,
        enum: ['on leave', 'working'],
        default: 'working',
    },
    date: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model("Notes", notesSchema);