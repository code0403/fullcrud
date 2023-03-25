const express = require("express");
const { NotesModel } = require("../models/notes.model");
const noteRouter = express.Router();
const jwt =  require("jsonwebtoken")


noteRouter.get("/", async (req, res) => {
  
  const token =  req.headers.authorization
  const decoded = jwt.verify(token, 'mischieve Managed')

    try {
      if(decoded){
        const notes = await NotesModel.find({"userID":decoded.userID})
        res.status(200).send(notes)
      }
      //  const notes = await NotesModel.find({"userID":""}) 
      //  res.status(200).send(notes)
    } catch (error) {
        console.log(error);
        res.status(400).send({"msg": error.message}) 
    }
})


noteRouter.post("/add" ,async (req, res) => {
   try {
    const note = new NotesModel(req.body)
    await note.save()
    res.status(200).send({"msg": "New Note Has Been Added"})
   } catch (error) {
     console.log(error);
     res.status(400).send({"msg": error.message})
   }
    
})


noteRouter.patch("/update/:noteID" ,async (req, res) => {

  const {noteID} = req.params
  const payload = req.body
  const token =  req.headers.authorization
  const decoded = jwt.verify(token, 'mischieve Managed')
  const req_id = decoded.userID
  const note = await NotesModel.find({_id:noteID})
  const userID_in_note = note[0].userID

  try {
    if(req_id  === userID_in_note){
      const note =  await NotesModel.findByIdAndUpdate({_id:noteID}, payload)
      res.status(200).send({"msg" : `Todo wit id:${noteID} has been updated`})
    } else {
      res.status(403).send({"msg": "You are not authorized to update this note"})
    }
  } catch (error) {
    res.status(400).send({"msg": error.message})
  }
    
})


noteRouter.delete("/delete/:noteID" ,async (req, res) => {

  const {noteID} = req.params
  const token =  req.headers.authorization
  const decoded = jwt.verify(token, 'mischieve Managed')
  const req_id = decoded.userID
  const note = await NotesModel.find({_id:noteID})
  const userID_in_note = note[0].userID
  
  // console.log(token)
  // console.log(decoded.userID)
  // console.log(note[0].userID)
  // console.log(userID_in_note)
  console.log(noteID)

  try {

    if(req_id  === userID_in_note){
      const noteDeleted = await NotesModel.findByIdAndDelete({_id:noteID})
      res.status(200).send({"msg" : `Todo with id:${noteID} has been deleted`})
    } else {
      res.status(403).send({"msg": "You are not authorized to delete this note"})
    }
    
  } catch (error) {
    res.status(400).send({"msg": error.message})
  }
    
})

module.exports = { noteRouter };

