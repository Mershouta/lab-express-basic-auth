const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const User = require('./models/user');

mongoose.connect('mongodb://localhost/basic-auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected');
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: 'basic-auth-secret',
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    user.save((err) => {
        if (err) return res.render('signup', { error: 'Error creating user' });
        res.redirect('/login');
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

