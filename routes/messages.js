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
router.get('/updateMessage', (req, res) => {
  // Récupérer le message_id de la chaîne de requête
  const message_id = req.query.message_id;
 console.log("pourquoi ça ne marche pas" + message_id);
  // Vérifier si message_id est un nombre
  if (!message_id || isNaN(message_id)) {
    req.session.errors = 'ID de message invalide';
    res.redirect('/messages');
    return;
  }

  // Utiliser findById pour obtenir les données du message
  const message = Message.findById(message_id);

  // Vérifier si le message existe
  if (!message) {
    req.session.errors = 'Message introuvable';
    res.redirect('/messages');
    return;
  }

  // Rendre la page de mise à jour avec les données du message
  res.render('messages/update', { message: message, errors: req.session.errors });
});


router.post('/updateMessage', (req, res, next) => {
  const message_id = req.body.message_id;
  const message_text = req.body.message_text;

  // Assurez-vous que l'ordre des paramètres est correct dans la méthode update
  Message.update(message_id, message_text);

  // Redirection vers la page des messages après la mise à jour
  res.redirect('/messages');
});




module.exports = router;
