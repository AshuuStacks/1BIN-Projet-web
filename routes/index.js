const express = require('express');
const router = express.Router();
const Message = require('../models/Message.js');
const Court = require('../models/Court.js');



router.get('/', (req, res) => {
    const totalMessages = Message.select();
    const totalBookings = Court.select();

    res.render('index.hbs', { totalMessages: totalMessages.total, totalBookings: totalBookings.total });
});
module.exports = router;