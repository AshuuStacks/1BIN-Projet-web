const express = require('express');
const router = express.Router();
const Message = require('../models/Message.js');


/* GET messages page. */
router.get('/', (req, res) => {
    const errors = req.session.errors;
  req.session.errors = null;
    res.render('messages/index.hbs', {  messages: Message.info(), errors: errors });
});

router.get('/details', (req, res) => {
    const messageId = req.query.message_id;
    const userId = req.query.user_id;

      
    if (isNaN(messageId)) {
      req.session.errors = 'No messages ';
      res.redirect('/messages');
      return;
    }
  
    if (isNaN(userId)) {
      req.session.errors = 'No users ';
      res.redirect('/messages');
      return;
    }
  
    const message = Message.findById(messageId);
    const coach = Message.findById(userId);

  
    if (!message) {
      req.session.errors = 'Messages not found';
      res.redirect('/message');
      return;

      if (!coach) {
        req.session.errors = 'Messages not found';
        res.redirect('/message');
        return;
      }
    }
   console.log("testt" + message);

    res.render('messages/index.hbs', { message , coach });
  });


module.exports = router;
