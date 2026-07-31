const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const platformRoutes = require('./routes/platformRoutes');


const dns = require('dns');
dns.setServers(["1.1.1.1","0.0.0.0"]);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);          
app.use('/api/users', userRoutes);          
app.use('/api/platforms', platformRoutes);  
app.use('/api/platform', platformRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devverse';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
        app.listen(PORT, () => {
            console.log(`🚀 DevVerse Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Database Connection Error:', err.message);
    });