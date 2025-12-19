
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());            
app.use(express.static('public'));


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });


const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  message: {
    type: String,
    required: true
  }
});


const Contact = mongoose.model('Contact', contactSchema);


app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(contact);
  } catch (err) {
    res.status(400).json({ message: 'Invalid contact ID' });
  }
});


app.post('/contacts', async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  if (!firstName || !email || !message) {
    return res.status(400).json({
      message: 'firstName, email and message are required'
    });
  }

  try {
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      message
    });

    await newContact.save();

    res.status(201).json({
      message: 'Contact saved successfully',
      contact: newContact
    });
  } catch (err) {
    res.status(500).json({ message: 'Error saving contact' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
