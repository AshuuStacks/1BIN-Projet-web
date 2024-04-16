const express = require('express');
const router = express.Router();
const Coach = require('../models/Coach.js');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
      const date = new Date();
    const uniquePrefix = date.getFullYear() + '-' +
      (date.getMonth() + 1) + '-' + date.getDate() + '-' +
      date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
      cb(null, uniquePrefix + '-' + file.originalname);
  }
})

const upload = multer({ storage: storage });


/* GET coaches page. */
router.get('/', (req, res) => {
  const errors = req.session.errors;
  req.session.errors = null;
    res.render('coaches/index.hbs', {  coaches: Coach.info(), errors: errors });
});


router.get('/details', (req, res) => {
    const userId = req.query.user_id;
    console.log("Voici le user id " + userId);
      
    // Check if courtId is a number
    if (isNaN(userId)) {
      req.session.errors = 'Invalid user id';
      res.redirect('/coaches');
      return;
    }
  
    const coach = Coach.findById(userId);
    // Check if coach exists
    if (!coach) {
      req.session.errors = 'Coach not found';
      res.redirect('/coaches');
      return;
    }


    res.render('coaches/details.hbs', { coach });
  });

  router.get('/update', (req, res) => {
    const userId = req.query.user_id;
      
    // Check if courtId is a number
    if (isNaN(userId)) {
      req.session.errors = 'Invalid user id';
      res.redirect('/coaches');
      return;
    }

  
    const coach = Coach.findById(userId);
  
    // Check if coach exists
    if (!coach) {
      req.session.errors = 'Coach not found';
      res.redirect('/coaches');
      return;
    }


    res.render('coaches/update.hbs', { coach });
  });
  router.post('/update', upload.single('picture_path'), (req, res, next) => {
  
    // Retrieve court ID and other details from the request body
    const coachId = req.body.user_id;
    const { biography } = req.body;
  
    const coach = Coach.findById(coachId);
  
    // If a new picture is uploaded, use it. Otherwise, use the existing picture path
    let picture = coach.picture_path;
    if (req.file) {
      picture = "/images/" + req.file.filename;
    }
  
    // Update the court with the new details
    Coach.update(coachId, biography, picture);
    res.redirect('/coaches/details?user_id=' + coachId);
  });


  router.post('/coaches/sendTo', (req, res) => {
    // Générer un message_id unique, par exemple en utilisant UUID ou une autre méthode
    const message_id = generateUniqueId(); // Remplacez ceci par votre fonction de génération d'ID

    // Récupérer le sender_id de la session de l'utilisateur
    const sender_id = req.session.user_id; // Assurez-vous que user_id est bien stocké dans la session lors de la connexion

    // Récupérer le receiver_id du formulaire
    const receiver_id = req.body.receiver_id;

    // Récupérer le texte du message du formulaire
    const message_text = req.body.message_text;

    // Récupérer la date et l'heure actuelles
    const date_hour_message = new Date().toISOString();

    // Insérer le message dans la base de données
    Message.save(message_id, sender_id, receiver_id, message_text, date_hour_message);

    // Rediriger l'utilisateur vers une page de confirmation ou de retour
    res.redirect('messages/confirmation.hbs');
});
module.exports = router;

