const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const validator = require('validator');


// /* GET user page. */
// router.get('/', (req, res) => {
//     res.render('users/index.hbs');
// });

/* GET user login page. */
router.get('/login', (req, res) => {
    if (req.session.connected) {
        res.redirect('/');
    }

    res.render('users/login.hbs', { errors: req.session.errors });
    req.session.errors = null;
});

/* POST user login page. */
router.post("/login", (req, res) => {
    const storedPassword = User.login(req.body.email);
    if (storedPassword && bcrypt.compareSync(req.body.password, storedPassword)) {
        req.session.connected = true;
        req.session.user = User.data(req.body.email);
        res.redirect('/');
    } else {
        if (!storedPassword) {
            req.session.errors = "Email incorrect";
        } else {
            req.session.errors = "Mot de passe incorrect";
        }
        res.redirect("/users/login");
    }
});


/* GET user register page. */
router.get('/create', (req, res) => {
    if (req.session.connected) {
        res.redirect('/');
    }
    res.render('users/create.hbs');
});

/* POST user register page. */
router.post('/create', (req, res) => {
    const { firstname, surname, email, password, passwordConfirmation } = req.body;

    // Validation
    let errors = [];
    if (!validator.isLength(firstname, { min: 1 })) {
        errors.push("Le prénom est requis");
    }
    if (!validator.isLength(surname, { min: 1 })) {
        errors.push('Le nom de famille est requis');
    }
    if (!validator.isEmail(email)) {
        errors.push("Format d'email invalide");
    }
    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0})) {
        errors.push('Le mot de passe doit avoir au moins 8 caractères et contenir au moins une lettre minuscule, une lettre majuscule et un chiffre');
    }
    if (password !== passwordConfirmation) {
        errors.push('La confirmation du mot de passe ne correspond pas au mot de passe');
    }
    if (!validator.isIn(email.split('@').pop(), ['vinci.be', 'student.vinci.be', 'coach.vinci.be'])) {
        errors.push("L'email doit se terminer par @vinci.be, @student.vinci.be ou @coach.vinci.be");
    }
    if (User.data(email)) {
        errors.push('Un compte existe déjà avec cet email');
    }

    if (errors.length === 0) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        User.save(firstname, surname, email, hashedPassword, 'normal');
        req.session.connected = false;
        res.redirect('/users/login');
    } else {
        res.render('users/create', { errors });
    }
});

/* GET user logout page. */
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
