const express = require('express');
const router = express.Router();
const Court = require('../models/Court.js');

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


/* GET courts page. */
router.get('/', (req, res) => {
  const errors = req.session.errors;
  req.session.errors = null;
  res.render('courts/index.hbs', { courts: Court.info(), errors: errors });
});

/* GET courts details page */
router.get('/details', (req, res) => {
  const courtId = req.query.tennis_court_id;
  
  // Check if courtId is a number
  if (isNaN(courtId)) {
    req.session.errors = 'Invalid court id';
    res.redirect('/courts');
    return;
  }

  const court = Court.findById(courtId);

  // Check if court exists
  if (!court) {
    req.session.errors = 'Court not found';
    res.redirect('/courts');
    return;
  }

  res.render('courts/details.hbs', { court });
});

/* GET courts update page */
router.get('/update', (req, res) => {
  
  if (req.session.connected && req.session.user.status === 'coach') {
      
      const courtId = req.query.tennis_court_id;
      
      // If court ID is not provided, redirect with an error
      if (!courtId) {
          req.session.errors = 'Veuillez fournir un ID de court';
          res.redirect('/courts');
          return;
      }

      const court = Court.findById(courtId);

      // If court is not found, redirect with an error
      if (!court) {
          req.session.errors = 'Court non trouvé, veuillez réessayer';
          res.redirect('/courts');
          return;
      }

      // Render the update form with the court data
      res.render('courts/update.hbs', { court });
  } else {
      // If the user is not a coach, redirect with an access denied message
      req.session.errors = 'Accès refusé: seuls les coachs peuvent mettre à jour les courts';
      res.redirect('/courts');
  }
});

/* POST courts update page */
router.post('/update', upload.single('picture_path'), (req, res, next) => {
  
  // Retrieve court ID and other details from the request body
  const courtId = req.body.tennis_court_id;
  const { name, flooring_type, location } = req.body;

  const court = Court.findById(courtId);

  // If a new picture is uploaded, use it. Otherwise, use the existing picture path
  let picture = court.picture_path;
  if (req.file) {
    picture = "/images/" + req.file.filename;
  }

  // Update the court with the new details
  Court.update(courtId, name, flooring_type, location, picture);
  res.redirect('/courts/details?tennis_court_id=' + courtId);
});

/* GET courts booking page */
// Will display the date of the booking and the court
router.get('/bookings', (req, res) => {

  // Check if the user is connected
  if (req.session.user !== undefined) {
    // Retrieve the user ID from the session, get the bookings and the court
    const userId = req.session.user.user_id;
    const bookings = Court.getBookings(userId);
    const bookingInfos = [];
    
    for (const booking of bookings) {
      const court = Court.findById(booking.tennis_court_id);
      // const courtName = court ? court.name : 'Court not found' do we need to check?
      bookingInfos.push({ court, booking });
  }

  res.render('courts/bookings.hbs', { bookings: bookingInfos });
  } else {
      // If the user is not connected, redirect with an error message
      req.session.errors = 'Veuillez vous connecter pour accéder à la page des réservations';
      res.redirect('/courts');
    }
});

router.post('/unbook', (req, res) => {
  // Extract court ID and booking date from the request body
  const { tennis_court_id, date_booking } = req.body;

  // Call the method to remove the booking
  const success = Court.unbook(tennis_court_id, date_booking);

  // Check if unbooking was successful
  if (success) {
      res.redirect('/courts/bookings');
  } else {
      req.session.errors = 'Failed to unbook the court.';
      res.redirect('/courts/bookings');
  }
});



module.exports = router;
