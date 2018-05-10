const express = require('express');
const path = require('path');

var app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

app.listen(port, () => {
    console.log(`Starting on port ${port}`);
});

module.exports = {app};