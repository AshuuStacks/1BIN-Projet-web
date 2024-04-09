const express = require('express');
const router = express.Router();
const Message = require('../models/Message.js');
const Coach = require('./coaches.js');


/* GET messages page. */
router.get('/', (req, res) => {
    const errors = req.session.errors;
  req.session.errors = null;
    res.render('messages/index.hbs', {  messages: Message.info(), errors: errors , receivers : Message.getReceiver() });
});

router.get('/ReplyTo', (req, res) => {
    const messageId = req.query.message_id;
    const userId = req.query.user_id;
    const receiverid = req.query.receiver_id
     console.log("receiver" + receiverid)
     console.log("receiver" + receiverid)

      
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
    const coach = Coach.findById(userId);
    const receiver = Message.getReceiver(receiverid);

  
    if (!message) {
      req.session.errors = 'Messages not found';
      res.redirect('/message');
      return;

    }

      if (!coach) {
        req.session.errors = 'Messages not found';
        res.redirect('/message');
        return;
      }


      
    
   console.log("testt" + message);

    res.render('messages/index.hbs', { message , coach , receiver });
  });




module.exports = router;
