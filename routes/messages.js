const express = require('express');
const router = express.Router();
const Message = require('../models/Message.js');


/* GET messages page. */
router.get('/', (req, res) => {
  const userId = req.session.user.user_id
     console.log("receiver id " + userId);
   const countMsg = Message.countMessage(userId);
   const msgg = Message.countMessageSender(userId);


    const errors = req.session.errors;
    let isRegular = false;
    if(req.session.connected){
      if( req.session.user.status == 'normal'){
        isRegular = true;
      }

    } 

    if(!req.session.connected){

      req.session.errors = 'Accès refusé | Connectez-vous pour accéder à vos messages';
      res.redirect('/coaches');
      return;
    }
    
  
  req.session.errors = null;
    res.render('messages/index.hbs', { errors: errors , messages : Message.info(isRegular), count : countMsg , count2 : msgg  });
});



router.post('/replyTo', (req, res) => { 
  const message_id = req.body.message_id; // Vous devez récupérer l'ID du message à partir du formulaire
  const response_text = req.body.response_text;

  // Utilisez la nouvelle méthode updateResponseText
  const result = Message.updateResponseText(message_id, response_text);
    res.redirect('/messages');
});

router.post('/suppmsg', (req, res) => { 
 const messageID = req.body.message_id;
 const message_id = Message.supprimerMessage(messageID);
  res.redirect('/messages');

});




module.exports = router;
