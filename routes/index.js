const express = require('express');
const router = express.Router();
const Message = require('../models/Message.js');
const Court = require('../models/Court.js');
const Tournament = require('../models/Tournament.js')



router.get('/', (req, res) => {
    const totalMessages = Message.select();
    const totalBookings = Court.select();
    const totalTournament = Tournament.select();

    res.render('index.hbs', { totalMessages: totalMessages.total, totalBookings: totalBookings.total , totalTournament: totalTournament.total});
});
module.exports = router;