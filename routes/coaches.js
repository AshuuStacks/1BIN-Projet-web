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


  router.post('/sendTo', (req, res, next) => {
  

      res.redirect('/messages/index.hbs');
  });

module.exports = router;
