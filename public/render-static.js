const fs = require('fs');
const path = require('path');
const express = require('express');
const ejs = require('ejs');

// Initialize an Express app
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Define the output folder for static HTML files
const outputFolder = path.join(__dirname, 'static');

// Ensure the output folder exists
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

// Function to render and save static files
const renderStaticFile = (view, output) => {
    // Adjust the file path to the actual directory of your EJS files
    const filePath = path.join(__dirname, 'views', `${view}.ejs`); // adjust 'views' if needed
    ejs.renderFile(filePath, {}, (err, str) => {
        if (err) {
            console.error(`Error rendering ${view}:`, err);
            return;
        }
        fs.writeFileSync(path.join(outputFolder, output), str);
        console.log(`${output} created successfully!`);
    });
};

// Render files
renderStaticFile('index', 'index.html');
renderStaticFile('projects', 'projects.html');
