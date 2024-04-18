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
const response = req.query.message_id;
  // Insérez le response_text dans la base de données
  const messages  = Message.insertResponse(message_id, response_text);

  console.log("test" + messages);

  // Redirigez l'utilisateur vers la page "/messages" (ou toute autre page appropriée)
  res.redirect('/messages');
});

module.exports = router;

      

 



module.exports = router;
