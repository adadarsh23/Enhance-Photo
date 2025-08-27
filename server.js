// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const path = require('path');
// const Message = require('./models/Message');

// // Load env
// dotenv.config();

// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// // MongoDB Atlas connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('✅ MongoDB Connected'))
//   .catch(err => console.error(err));

// // Twilio client
// const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// // Routes
// app.post('/send', async (req, res) => {
//   try {
//     const { name, phone, email, date, time, message } = req.body;

//     // Save in MongoDB
//     const newMessage = new Message({ name, phone, email, date, time, message });
//     await newMessage.save();

//     // Send WhatsApp Message
//     const twilioMessage = await client.messages.create({
//       from: process.env.TWILIO_WHATSAPP_NUMBER,
//       to: `whatsapp:${phone}`,
//       body: `Hello ${name},\nYour booking is confirmed!\n📅 Date: ${date}\n🕒 Time: ${time}\n📩 Message: ${message}`
//     });

//     console.log('✅ WhatsApp Sent:', twilioMessage.sid);
//     res.send('<h2>Message sent and saved successfully!</h2><a href="/">Go Back</a>');

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('❌ Error sending message');
//   }
// });

// // Start server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));



// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const path = require('path');
// const Message = require('./models/Message');

// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// // MongoDB Atlas connection (keep this one in env for safety)
// mongoose.connect("mongodb+srv://adrajpu523:WwRd4T7leTf0fIEo@cluster0.13rrc3k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('✅ MongoDB Connected'))
//   .catch(err => console.error(err));

// // Route
// app.post('/send', async (req, res) => {
//   try {
//     const { accountSid, authToken, twilioNumber, name, phone, email, date, time, message } = req.body;

//     // Save in MongoDB
//     const newMessage = new Message({ accountSid, authToken, twilioNumber, name, phone, email, date, time, message });
//     await newMessage.save();

//     // Twilio client (dynamic credentials)
//     const client = require('twilio')(accountSid, authToken);

//     // Send WhatsApp message
//     const twilioMessage = await client.messages.create({
//       from: twilioNumber,
//       to: `whatsapp:${phone}`,
//       body: `Hello ${name},\nYour booking/message is confirmed!\n📅 Date: ${date}\n🕒 Time: ${time}\n📩 Message: ${message}`
//     });

//     console.log('✅ WhatsApp Sent:', twilioMessage.sid);
//     res.send('<h2>Message sent and saved successfully!</h2><a href="/">Go Back</a>');

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('❌ Error sending message');
//   }
// });

// // Start server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));



import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import imageRoutes from './routes/imageRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Set EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Atlas
mongoose.connect(process.env.MONGO_URI,)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/images', imageRoutes);

app.get('/', async (req, res) => {
  const { uploadedId, enhancedId } = req.query;
  res.render('index', { uploadedId, enhancedId });
});
// Handle 404 for all other routes
app.use((req, res) => {
  res.status(404).render('404');
});
// Catch-all for 404 API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

