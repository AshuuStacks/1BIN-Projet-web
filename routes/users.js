const express = require('express');
const router = express.Router();

const User = require('../models/User.js');

router.get('/login', (req, res) => {
    res.render('users/login.hbs', { error: req.session.error });
    req.session.error = null;
});

router.post('/login', (req, res) => {
    const user = User.login(req.body.email, req.body.password);
    if (user) {
        req.session.user = user;
        res.redirect('/');
    } else {
        req.session.error = 'Invalid email or password';
        res.redirect('/users/login');
    }
});

router.get('/register', (req, res) => {
    res.render('users/register.hbs');
});

router.post('/register', (req, res) => {
    User.register(req.body.firstname, req.body.surname, req.body.email, req.body.password);
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;