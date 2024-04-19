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

    } 

    if(!req.session.connected){

      req.session.errors = 'Vous ne pouvez pas accéder aux messages';
      res.redirect('/coaches');
      return;
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
  const message_id = req.body.message_id; // Vous devez récupérer l'ID du message à partir du formulaire
  const response_text = req.body.response_text;

  // Utilisez la nouvelle méthode updateResponseText
  const result = Message.updateResponseText(message_id, response_text);
    res.redirect('/messages');
});


module.exports = router;
