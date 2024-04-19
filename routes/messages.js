const express = require('express');
const router = express.Router();
const Message = require('../models/Message.js');


/* GET messages page. */
router.get('/', (req, res) => {
    const errors = req.session.errors;
    let isRegular = false;
    if(req.session.connected){
      if( req.session.user.status == 'normal'){
        isRegular = true;
      }

    } else {
      req.session.errors='Il faut être connecté pour accéder aux messages';
      console.log("Il faut être connecté pour accéder aux messages");
      res.redirect('/coaches')
    }
    
  
  req.session.errors = null;
    res.render('messages/index.hbs', { errors: errors , messages : Message.info(isRegular)  });
});

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

router.post('/replyTo', (req, res) => { 
    const sender_id = req.session.user.user_id;
        const receiver_id = req.body.receiver_id; // ID récupéré de la requête
    console.log("test" + sender_id + "test 2 " + receiver_id + "test 3" + date_hour_message);
    const message = {
        response_text : req.body.response_text,
        date_hour_message: date_hour_message,
        sender_id: sender_id,
        receiver_id: receiver_id
    };

    Message.push(message);
    res.redirect('/messages');
});


module.exports = router;
