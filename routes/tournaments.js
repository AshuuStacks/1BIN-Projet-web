const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament.js');


const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/images/tournaments/');
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
    const errors =req.session.errors
    req.session.errors = null;
    tournamentsTable.forEach(tournament => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    tournament.date_tournament = new Date(tournament.date_tournament).toLocaleDateString('fr-FR', options);
});
    res.render('tournaments/index.hbs', { tournamentsTable , errors });
});



/* GET details tournaments */
router.get('/details', function (req, res, next) {
    console.log("GET DETAILS TOURNAMENTS");
    const tournamentID = req.query.tournament_id;
    if(!tournamentID){
        req.session.errors = 'invalid tournament id ';
        res.redirect('/tournaments');
    }
    const tournament = Tournament.findById(tournamentID);

    if(!tournament) {
        req.session.errors = 'Tournament was not found';
       res.redirect('/tournaments');
    }
    res.render('tournaments/details.hbs', { tournament, getNumberOfRegistrations: Tournament.getNumberOfRegistrations(tournamentID)});
});


/* GET creation tournaments */
router.get('/create', function (req, res, next) {
    console.log("GET THE CREATION PAGE");
    res.render('tournaments/create.hbs');
});


router.post('/register', function(req, res, next) {
    const tournamentId = req.body.tournamentId;
    const userId = req.session.user.user_id;

    // Vérifier si la date du tournoi est passée ou si le tournoi est complet
    if (isTournamentDatePassed(tournamentId) || isTournamentFull(tournamentId)) {
        req.session.error = "Impossible de s'inscrire au tournoi";
        return res.redirect('/tournaments/details/' + tournamentId);
    }

    // Inscrivez l'utilisateur au tournoi
    Tournament.registerUser(userId, tournamentId);
    req.session.success = "Inscription réussie au tournoi ✅";
    res.redirect('/tournaments/details/' + tournamentId);
});

router.post('/unregister', function(req, res, next) {
    const tournamentId = req.body.tournamentId;
    const userId = req.session.user.user_id;

    // Désinscrire l'utilisateur du tournoi
    Tournament.unregisterUser(userId, tournamentId);
    req.session.success = "Désinscription réussie du tournoi ✅";
    res.redirect('/tournaments/details/' + tournamentId);
});

function isTournamentDatePassed(tournamentId) {
    // Ici, vous devriez récupérer la date du tournoi depuis la base de données
    let tournamentDate = new Date("2024-05-01"); // Remplacez par la date du tournoi depuis la base de données
    let currentDate = new Date();
    return currentDate > tournamentDate;
}

function isTournamentFull(tournamentId) {
    // Ici, vous devriez récupérer le nombre d'inscrits et le nombre maximum d'inscrits depuis la base de données
    let currentParticipants = 50; // Remplacez par le nombre d'inscrits depuis la base de données
    let maxParticipants = 100; // Remplacez par le nombre maximum d'inscrits depuis la base de données
    return currentParticipants >= maxParticipants;
}

// route pour creer tournoi
router.get('/create', function(req, res, next) {
    res.render('tournaments/creation.hbs'); 
});

router.post('/create', upload.single('banner'), function(req, res, next) {
    // Valider la date du tournoi
    const currentDate = new Date();
    const tournamentDate = new Date(req.body.date);

    // Vérifier si la date du tournoi est dépassée
    if (currentDate > tournamentDate) {
        req.session.error = "La date du tournoi est déjà passée ❌";
        return res.redirect('/tournaments'); // Rediriger vers la page de création avec le message d'erreur
    }

    // Récupérer l'identifiant de l'utilisateur connecté
    //console.log(req.session)
    const userId = req.session.user.user_id;

    // Créer le tournoi avec le créateur associé
    Tournament.save({
        name: req.body.name,
        banner_image_path:  req.file ? '/images/' + req.file.filename : null,  // Path de l'image si elle est téléversée
        date_tournament: req.body.date,
        nb_max_participants: req.body.maxParticipants,
        creator: userId // Associer l'identifiant de l'utilisateur connecté comme créateur du tournoi
    });

    req.session.success = "Le tournoi a été créé avec succès ✅";
    res.redirect('/tournaments');
});









module.exports = router;