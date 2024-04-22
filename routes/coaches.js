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
      req.session.errors = "Accès refusé | l'User ID fourni n'existe pas";
      res.redirect('/coaches');
      return;
    }
  
    const coach = Coach.findById(userId);
    // Check if coach exists
    if (!coach) {
      req.session.errors = " Accès refusé | La biographie de ce coach n'existe pas";
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

  

  router.post('/sendTo', (req, res, next) => {  
 
    
    const sender_id = req.session.user.user_id;
        const receiver_id = req.body.receiver_id; // ID récupéré de la requête
        const date = new Date();

        // Obtient le décalage horaire en minutes et le convertit en millisecondes
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        
        // Ajuste la date en fonction du décalage horaire local
        const localDate = new Date(date - timezoneOffset);
        
        // Formate la date au format souhaité 'YYYY-MM-DD HH:MM:SS'
        const date_hour_message = localDate.toISOString().replace('T', ' ').substring(0, 19);
        
        console.log(date_hour_message);
    console.log("test" + sender_id + "test 2 " + receiver_id + "test 3" + date_hour_message);
    const message = {
        message_text: req.body.message_text,
        date_hour_message: date_hour_message,
        sender_id: sender_id,
        receiver_id: receiver_id
    };

    Coach.push(message);
    res.redirect('/messages');
});



    
module.exports = router;

