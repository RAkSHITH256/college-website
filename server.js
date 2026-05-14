const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// API endpoint to handle application submissions
app.post('/api/apply', (req, res) => {
    const { firstName, lastName, email, phone, program, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !program) {
        return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const sql = `INSERT INTO applications (firstName, lastName, email, phone, program, message) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [firstName, lastName, email, phone, program, message];

    db.run(sql, params, function(err) {
        if (err) {
            console.error('Error saving application:', err.message);
            return res.status(500).json({ error: 'Failed to submit application. Please try again later.' });
        }
        res.status(201).json({ 
            success: true, 
            message: 'Application submitted successfully!',
            id: this.lastID 
        });
    });
});

// Fallback route to serve index.html for unknown routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
