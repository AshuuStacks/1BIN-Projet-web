const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament.js');


const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/images/courts/');
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



/* GET tournaments index. */
router.get('/', function (req, res, next) {
    const tournamentsTable = Tournament.list();
    res.render('tournaments/index.hbs', { tournamentsTable });
});


/* GET details tournaments */
router.get('/details', function (req, res, next) {
    console.log("GET DETAILS TOURNAMENTS");
    const tournamentID = req.query.tournament_id;
    const tournament = Tournament.findById(tournamentID)
    res.render('tournaments/details.hbs', { tournament });
});


/* GET creation tournaments */
router.get('/create', function (req, res, next) {
    console.log("GET THE CREATION PAGE");
    res.render('tournaments/create.hbs');
});


/* Create a tournament */
router.post('/create', upload.single('imageTournament'), function (req, res, next) {
  console.log("Create a tournament");
  // validate name of explanet -> betweeen 3 and 100 character
  if (validator.isLength(req.body.uniqueNameTournament, { min: 3, max: 100 })) {
      console.log("req.file : " + JSON.stringify(req.file));
      let filename = null;
      // req.file must be undefined if no file given
      if (req.file === undefined) filename = null;
      else filename = 'images/' + req.file.filename;
      Tournament.save({
          uniqueName: req.body.uniqueNameTournament,
          date: req.body.dateTournament,
          maxpoeple: req.body.maxPeople,
          image: filename
      });
      res.redirect('/tournament');
  }
  else {
      res.redirect('/tournament?errors= Le nom d\'un tournoi doit faire entre 3 et 100 caractères');
  }
});





module.exports = router;