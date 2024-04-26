const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament.js');


const multer = require('multer');
const session = require('express-session');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/images/');
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
let registeredStatus = false;

/* GET tournaments index. */
router.get('/', function (req, res, next) {
    const tournamentsTable = Tournament.list();
    const errors = req.session.errors;
    req.session.errors = null;
    const success = req.session.success;
    req.session.success = null;
    tournamentsTable.forEach(tournament => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    tournament.date_tournament = new Date(tournament.date_tournament).toLocaleDateString('fr-FR', options);
});
    res.render('tournaments/index.hbs', { tournamentsTable , errors, success : success });
});


/* GET details tournaments */
router.get('/details', function (req, res, next) {
    console.log("GET DETAILS TOURNAMENTS");
    const tournamentID = req.query.tournament_id;
    if(!tournamentID){
        req.session.errors = 'Id du tournoi invalid ';
        res.redirect('/tournaments');
        return;
    }
    const tournament = Tournament.findById(tournamentID);
    if(!tournament) {
        req.session.errors = "Ce tournoi n'existe pas! Faites attention aux fautes de frappe .Si l'errreur persiste, contactez un responsable";
        res.redirect('/tournaments');
        return;
    }
    const getNumberOfRegistrations = Tournament.getNumberOfRegistrations(tournamentID);
    let depasse;
    if(new Date(tournament.date_tournament) < new Date()){
        depasse=true;
    } else {
        depasse=false;
    }
    let full;
    if(getNumberOfRegistrations >= tournament.nb_max_participants){
        full=true;
    } else {
        full=false;
    }

    let isUserRegistered= false;
    if (req.session.user) {
        isUserRegistered= Tournament.isUserRegistered(req.session.user.user_id, tournamentID);
    }

    const coach = Tournament.creatorOfTournament(tournamentID)

    console.log(depasse);
    console.log(full);
    console.log(isUserRegistered);
    res.render('tournaments/details.hbs', { tournament, getNumberOfRegistrations, isUserRegistered , depasse , full, coach});
});


router.post('/register', function(req, res, next) {
    const tournamentId = req.body.tournament_id;
    if (req.session.user){
        const userId = req.session.user.user_id;
        Tournament.registerUser(userId, tournamentId);
        req.session.success = "Inscription réussie au tournoi ✅";
        registeredStatus = true;
    }
    res.redirect('/tournaments/details?tournament_id=' +tournamentId);

});


router.post('/unregister', function(req, res, next) {

    const tournamentId = req.body.tournament_id;
    if (req.session.user) {
        const userId = req.session.user.user_id;
        Tournament.unregisterUser(userId, tournamentId);
        req.session.success = "Vous venez de vous désinscrire du tournoi ";
        registeredStatus = false;
    }
    res.redirect('/tournaments/details?tournament_id=' + tournamentId);
});


/* GET creation tournaments */
router.get('/create', function (req, res, next) {
    const errors = req.session.error    ; 
 if(!req.session.connected){ 
    req.session.errors="Vous n'avez pas accès à cette page";
    res.redirect('/tournaments');
    return;
 }
 if(req.session.user.status === 'normal'){
    req.session.errors = "Accès refusé | Vous n'avez pas accès à cette page";
    res.redirect('/tournaments');
    return;
  }
    console.log("GET THE CREATION PAGE");
    let minDate = new Date().toISOString().slice(0,10);
    res.render('tournaments/create.hbs',{errors : errors, minDate});
});

router.post('/create', upload.single('filename'), function(req, res, next) {
    console.log("POST CREATE TOURNAMENT");
    console.log("req.file : " + JSON.stringify(req.file));
    const currentDate = new Date();
    const tournamentDate = new Date(req.body.date_tournament);
    console.log("TEST");
    console.log(currentDate);
    console.log(tournamentDate);
    if (currentDate > tournamentDate) {
        req.session.errors= "La date du tournoi est déjà passée ❌";
        return res.redirect('/tournaments'); 
    }
    if (req.file === undefined) filename = null;
    else filename = '/images/' + req.file.filename;
    Tournament.save({
        name: req.body.uniqueNameTournament,
        date_tournament: req.body.dateTournament,
        nb_max_participants: req.body.maxPeople,
        banner_image_path: filename,
        creator:req.body.creator
    });

    req.session.success = "Le tournoi a été créé avec succès ✅";
    res.redirect('/tournaments');
});




module.exports = router;