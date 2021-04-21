// Express modules
const express = require('express');

// Custom modules
const imageRoutes = require('./routes/images');

// Server variables
const app = express();
app.set('view engine', 'ejs');

// Add middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(imageRoutes);

app.listen(3000);