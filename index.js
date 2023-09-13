const express = require("express");
const app = express();
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv').config();
app.use(cors());

app.use(express.json());
// app.use(express.urlencoded({extended: true}));

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const imageStore = [];
const notes = [];
app.post("/addNote", (request, response) => {
  const { text, timecode } = request.body;
  if (text && timecode) {
    const note = {text : text, timecode: timecode}
    notes.push(note);
    response.status(201).json({ message: "Note added successfully" });
  } else {
    response.status(400).json({ message: "Text is required to add a note" });
  }
});

app.get("/getNotes", (request, response) => {
  response.status(200).json(notes);
});

app.put("/editNote", (request, response) => {
  const { newText, timecode } = request.body;
  if (!newText) {
    response.status(400).json({ message: "New text is required to edit the note" });
    return;
  }
  const noteIndex = notes.findIndex((note) => note.timecode === timecode);
  if (noteIndex === -1) {
    response.status(404).json({ message: "Note not found" });
  } else {
    notes[noteIndex].text = newText;
    response.status(200).json({ message: "Note edited successfully" });
  }
});


app.post("/syncNotes", (request, response) => {
  const { text } = request.body;
  if (text) {
    notes.push(text);
    response.status(201).json({ message: "Note added successfully synced" });
  } else {
    response.status(400).json({ message: "Text is required to add a note" });
  }
});

app.post('/uploadImage', (req, res) => {
  const { imageText, timestamp } = req.body;

  if (!imageText || !timestamp) {
    return res.status(400).json({ error: 'Both imageText and timestamp are required.' });
  }

  // Add the data to the temporary storage
  imageStore.push({ imageText, timestamp });

  res.status(200).json({ message: 'Image data stored successfully.' });
});

app.put('/updateImage', (req, res) => {
  const { imageText, timestamp } = req.body;

  if (!imageText || !timestamp) {
    return res.status(400).json({ error: 'Both imageText and timestamp are required.' });
  }

  // Find the image by timestamp in the imageStore
  const imageToUpdateIndex = imageStore.findIndex((image) => image.timestamp === timestamp);

  if (imageToUpdateIndex === -1) {
    return res.status(404).json({ error: 'Image not found.' });
  }
  // Update the image data
  imageStore[imageToUpdateIndex].imageText = imageText;

  res.status(200).json({ message: 'Image data updated successfully.' });
});

// Endpoint to retrieve all stored image data
app.get('/getImages', (req, res) => {
  res.status(200).json(imageStore);
});



app.listen(4000, () =>
  console.log(`Hello world, app is listening on port 4000!`)
);
