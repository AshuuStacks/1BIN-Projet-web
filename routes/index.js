const express = require('express');
const router = express.Router();
const Message = require('../models/Message.js');


router.get('/', (req, res) => {
    const totalMessages = Message.select();
    res.render('index.hbs', { totalMessages: totalMessages.total });
});
module.exports = router;