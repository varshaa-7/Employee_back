const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
    notes:{
        type:String,
        required: false,
    },
    posts:{
        type:String,
        required:false,
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
        required: false,
    },
    leaveReason: {
        type: String,
        required: false,
    },
    leaveStartDate: {
        type: Date,
        required: false,
    },
    leaveEndDate: {
        type: Date,
        required: false,
    },
    inst:{
        type:String,
        required:false,
    },
});

module.exports = mongoose.model("Notes", notesSchema);
