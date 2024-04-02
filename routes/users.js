// const express = require('express');
// const router = express.Router();

// const User = require('../models/User.js');

// router.get('/login', (req, res) => {
//     res.render('users/login.hbs', { error: req.session.error });
//     req.session.error = null;
// });

// router.post('/login', (req, res) => {
//     const user = User.login(req.body.email, req.body.password);
//     if (user) {
//         req.session.user = user;
//         res.redirect('/');
//     } else {
//         req.session.error = 'Invalid email or password';
//         res.redirect('/users/login');
//     }
// });

// router.get('/register', (req, res) => {
//     res.render('users/register.hbs');
// });

// router.post('/register', (req, res) => {
//     User.register(req.body.firstname, req.body.surname, req.body.email, req.body.password);
//     res.redirect('/');
// });

// router.get('/logout', (req, res) => {
//     req.session.destroy();
//     res.redirect('/');
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const bcrypt = require('bcrypt');


/* GET user page. */
router.get('/', (req, res) => {
    res.render('users/index.hbs'); // Render the user page (which will be used for both login and registration)
});

/* GET user login page. */
router.get('/login', (req, res) => {
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
router.get('/register', (req, res) => {
    res.render('users/register.hbs'); // Render the register page
});

/* POST user register page. */
router.post('/register', (req, res) => {
    const firstname = req.body.firstname;
    const surname = req.body.surname;
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 10);
    const status = 'normal';
    User.save(firstname, surname, email, password, status);
    req.session.connected = true;
    res.redirect('/'); // Redirect to the login page
});

/* GET user logout page. */
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
