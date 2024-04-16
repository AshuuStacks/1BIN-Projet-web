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
      console.log("Il faut être connecté pour accéder aux messages");
      res.redirect('/')
    }
    
  
  req.session.errors = null;
    res.render('messages/index.hbs', { errors: errors , messages : Message.info(isRegular)  });
});




      

 



module.exports = router;
