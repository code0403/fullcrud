const mongoose=require("mongoose");

const notesSchema = mongoose.Schema({
    title: String,
    body: String,
    sub: String,
    userID:String
})

const NotesModel = mongoose.model("note", notesSchema)

module.exports = { NotesModel };