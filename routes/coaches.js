const express = require('express');
const router = express.Router();
const Coach = require('../models/Coach.js');

const multer = require('multer');

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // Destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    // Create a unique filename based on the current date and time
    const date = new Date();
    const uniquePrefix = date.getFullYear() + '-' +
      (date.getMonth() + 1) + '-' + date.getDate() + '-' +
      date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
    cb(null, uniquePrefix + '-' + file.originalname);
  }
});

// Initialize multer with the defined storage configuration
const upload = multer({ storage: storage });

/* GET coaches page. */
router.get('/', (req, res) => {
  const errors = req.session.errors;
  req.session.errors = null;
  // Render the coaches page and pass coaches data and any errors to the view
  res.render('coaches/index.hbs', { coaches: Coach.info(), errors: errors });
});

// Route for displaying coach details
router.get('/details', (req, res) => {
  const userId = req.query.user_id;

  // Check if userId is a number
  if (isNaN(userId)) {
    // Redirect with error message if userId is not a number
    req.session.errors = "Accès refusé | l'User ID fourni n'existe pas";
    res.redirect('/coaches');
    return;
  }
   const nombreMessage = Coach.countMessageUnRead(userId);
  const coach = Coach.findById(userId);

  // Check if coach exists
  if (!coach) {
    // Redirect with error message if coach doesn't exist
    req.session.errors = " Accès refusé | La biographie de ce coach n'existe pas";
    res.redirect('/coaches');
    return;
  }
  if (coach.status === 'normal') {
    // Redirect with error message if the user is not a coach
    req.session.errors = " Accès refusé | Cet utilisateur n'est pas un coach";
    res.redirect('/coaches');
    return;
  }

  // Render the coach details page with coach data
  res.render('coaches/details.hbs', { coach , nombreMessage });
});

// Route for updating coach biography
router.get('/updateBio', (req, res) => {
  const userId = req.query.user_id;

  // Check if userId is a number
  if (isNaN(userId)) {
    // Redirect with error message if userId is not a number
    req.session.errors = "Accès refusé | l'User ID fourni n'existe pas";
    res.redirect('/coaches');
    return;
  }

  // Redirect if user is not logged in
  if (!req.session.connected) {
    req.session.errors ="Accès refusé | Vous ne pouvez pas accéder à cette page";
    res.redirect('/coaches');
    return;
  }
  
  const coach = Coach.findById(userId);

  // Check if coach exists
  if (!coach) {
    // Redirect with error message if coach doesn't exist
    req.session.errors = "Accès refusé | Le coach n'existe pas";
    res.redirect('/coaches');
    return;
  }

  // Check if user is an regular user
  if (req.session.user.status === 'normal') {
    // Redirect with error message if user is not an regular user
    req.session.errors = "Accès refusé | Vous n'avez pas accès à cette page";
    res.redirect('/coaches');
    return;
  } 
  
  // Check if the logged in user is the same as the coach being updated
  if (parseInt(req.session.user.user_id) !== parseInt(req.query.user_id)) {
    // Redirect with error message if the logged in user is not the coach being updated
    req.session.errors = "Accès refusé | Vous n'avez pas accès à cette page ";
    res.redirect('/coaches');
    return;
  }

  // Render the coach update page with coach data
  res.render('coaches/update.hbs', { coach });
});

// Route for processing coach biography update
router.post('/updateBio', upload.single('picture_path'), (req, res, next) => {
  // Retrieve coach ID and other details from the request body
  const coachId = req.body.user_id;
  const { biography } = req.body;

  const coach = Coach.findById(coachId);

  // If a new picture is uploaded, use it. Otherwise, use the existing picture path
  let picture = coach.picture_path;
  if (req.file) {
    picture = "/images/" + req.filename;
  }

  // Update the coach with the new details
  Coach.update(coachId, biography, picture);
  // Redirect to the coach details page after update
  res.redirect('/coaches/details?user_id=' + coachId);
});

// Route for sending messages to coaches
router.post('/sendTo', (req, res, next) => {  
  const sender_id = req.session.user.user_id;
  const receiver_id = req.body.receiver_id; 
  const today = new Date();
  const todayString =    today.getDate() + "/" + (today.getMonth() + 1)  + "/"+today.getFullYear() + " | " + today.getHours()+":" + today.getMinutes() + ":" + today.getSeconds() ;
  const message = {
    message_text: req.body.message_text,
    date_hour_message: todayString,
    sender_id: sender_id,
    receiver_id: receiver_id
  };

  // Push the message to the coach's message array
  Coach.push(message);
  // Redirect to the messages page after sending the message
  res.redirect('/messages');
});
router.post('/Licencier', (req, res, next) => {  
  const userID = req.body.status;
  Coach.updateStatus(userID);

  res.redirect('/coaches');


});


  router.post('/Approuval', (req, res, next) => {  
       let approuve = true;
       req.session.approuve = approuve;

    res.redirect('/coaches');
  
});




module.exports = router;
