const express = require('express');
const router = express.Router();
const Message = require('../models/Message.js');
const Court = require('../models/Court.js');
const Tournament = require('../models/Tournament.js')
const Coach = require('../models/Coach.js');




router.get('/', (req, res) => {
    const totalMessages = Message.select();
    const totalBookings = Court.select();
    const totalTournament = Tournament.select();

    res.render('index.hbs', { totalMessages: totalMessages.total, totalBookings: totalBookings.total , totalTournament: totalTournament.total});
});

router.post('/votre_route', (req, res) => {
    const userId = req.body.user_id;
    const nombreMessage = Coach.countMessageUnRead(userId);
    console.log("asasa" + userId);

    console.log("asasa" + nombreMessage);
    if(nombreMessage != 0){
        req.session.nombreMessage = "("+nombreMessage+")";
    }
    res.redirect('/');
});
module.exports = router;