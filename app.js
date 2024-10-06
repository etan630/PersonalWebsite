const express = require('express');
const app = express();
const path = require('path');

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files (like CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Define the home route to render the index.ejs file
app.get('/', (req, res) => {
    res.render('index'); // This serves the home page (index.ejs)
});

// Define the projects route to render the projects.ejs file
app.get('/projects', (req, res) => {
    res.render('projects'); // This serves the projects page (projects.ejs)
});

// Start the server on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
