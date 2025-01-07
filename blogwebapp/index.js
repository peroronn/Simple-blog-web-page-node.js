const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + '/public')); 

const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database.db', function(err) {
    if (err) {
        console.error(err);
        process.exit(1); 
    } else {
        console.log("Database connected");
        global.db.run("PRAGMA foreign_keys=ON"); 
    }
});

app.get('/', (req, res) => {
    res.render('index');
});

const authorRoutes = require('./routes/author');
const readerRoutes = require('./routes/reader');
const userRoutes = require('./routes/users');
const blogRoutes = require('./routes/blog');
app.use('/author', authorRoutes);
app.use('/reader', readerRoutes);
app.use('/', userRoutes);
app.use('/blog', blogRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});