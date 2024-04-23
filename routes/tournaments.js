const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament.js');


const multer = require('multer');
const session = require('express-session');
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
    const success =req.session.success
    req.session.success = null;
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
        req.session.errors = 'Id du tournoi invalid ';
        res.redirect('/tournaments');
    }
    const tournament = Tournament.findById(tournamentID);
    const getNumberOfRegistrations = Tournament.getNumberOfRegistrations(tournamentID)
    if(!tournament) {
        req.session.errors = 'Tournoi introuvable';
       res.redirect('/tournaments');
    }
    res.render('tournaments/details.hbs', { tournament, getNumberOfRegistrations, });
});

router.post('/register', function(req, res, next) {
    const tournamentId = req.body.tournament_id;
    const userId = req.session.user.user_id;
    Tournament.registerUser(userId, tournamentId);
    req.session.success = "Inscription réussie au tournoi ✅";
    res.redirect('/tournaments');
});


router.post('/unregister', function(req, res, next) {
    const tournamentId = req.body.tournament_id;
    const userId = req.session.user.user_id;
    // Désinscrire l'utilisateur du tournoi
    Tournament.unregisterUser(userId, tournamentId);
    req.session.success = "Vous venez de vous désinscrire au tournoi ";
    res.redirect('/tournaments');
});


/* GET creation tournaments */
router.get('/create', function (req, res, next) {
    const errors = req.session.errors;

 if(!req.session.connected){ /* C'est moi(Ashu) qui a ajouté comme ça les gens pas connecté n'ont pas accès à la création du tournoi
                                faudrait aussi faire pour les gens qui sont pas coaches ou soit tu mets && user.status === 'normal*/

    req.session.errors="Vous n'avez pas accès à cette page";
    res.redirect('/tournaments')

 }
    console.log("GET THE CREATION PAGE");
    res.render('tournaments/create.hbs',{errors : errors});
});

router.post('/create', upload.single('filename'), function(req, res, next) {
    console.log("POST CREATE TOURNAMENT");
    console.log("req.file : " + JSON.stringify(req.file));
    const currentDate = new Date();
    const tournamentDate = new Date(req.body.date);
    if (currentDate > tournamentDate) {
        req.session.error = "Accès refusé |La date du tournoi est déjà passée ❌";
        return res.redirect('/tournaments'); 
    }

    if (req.file === undefined) filename = null;
    else filename = 'images/' + req.file.filename;
    Tournament.save({
        name: req.body.uniqueNameTournament,
        date_tournament: req.body.dateTournament,
        nb_max_participants: req.body.maxPeople,
        banner_image_path: filename,  
    });
    req.session.success = "Le tournoi a été créé avec succès ✅";
    res.redirect('/tournaments');
});


module.exports = router;