const express = require('express');
const router = express.Router();
const Message = require('../models/Message.js');


/* GET messages page. */
router.get('/', (req, res) => {
    const errors = req.session.errors;

  req.session.errors = null;
    res.render('messages/index.hbs', { errors: errors , messages : Message.info()  });
});




      

 



module.exports = router;
