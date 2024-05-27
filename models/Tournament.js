const db = require('../models/db_conf');

module.exports.list = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const stmt_all = db.prepare("SELECT * FROM tournaments WHERE date_tournament >= ? ORDER BY date_tournament");
    return stmt_all.all(currentDate);
};

module.exports.isUserRegistered = (userId, tournamentId) => {
    const stmt = db.prepare("SELECT COUNT(*) AS count FROM registrations WHERE user_id = ? AND tournament_id = ?");
    const result = stmt.get(userId, tournamentId);
    return result.count > 0; 
};

module.exports.findById = (id) => {
    return db.prepare("SELECT * FROM tournaments WHERE tournament_id = ?  ").get(id);
};

module.exports.getNumberOfRegistrations = (tournamentId) => {
    const stmt = db.prepare("SELECT COUNT(*) AS count FROM registrations WHERE tournament_id = ?");
    const result = stmt.get(tournamentId);
    return result.count; 
};

module.exports.registerUser =  (userId, tournamentId) => {
    const stmt_insert = db.prepare("INSERT INTO registrations (user_id, tournament_id) VALUES (?, ?)");
    stmt_insert.run(userId, tournamentId);
};

module.exports.unregisterUser= (userId, tournamentId) => {
    const stmt_delete = db.prepare("DELETE FROM registrations WHERE user_id = ? AND tournament_id = ?");
    stmt_delete.run(userId, tournamentId);
};

module.exports.save = (tournamentDetails) => {
    console.log("SAVE :" + JSON.stringify(tournamentDetails));
    if(tournamentDetails.id===undefined){
    const stmt = db.prepare('INSERT INTO tournaments (name, date_tournament,nb_max_participants, banner_image_path, creator ) VALUES (?, ?, ?, ?, ?)');
    stmt.run(tournamentDetails.name, tournamentDetails.date_tournament, tournamentDetails.nb_max_participants,tournamentDetails.banner_image_path, tournamentDetails.creator);
    }
};

module.exports.select = () => {
    const stmt_select = db.prepare("SELECT COUNT(*) AS total FROM tournaments WHERE date_tournament > date('now');");
    return stmt_select.get();
}

module.exports.creatorOfTournament = (tournament) => {
    return db.prepare("SELECT u.firstname, u.surname FROM users u, tournaments t  WHERE u.user_id = t.creator AND t.tournament_id= ?").get(tournament);
};

module.exports.info = (name) => {
    // Préparer la requête SQL pour rechercher un nom de tournoi spécifique
    const stmt = db.prepare("SELECT name FROM tournaments WHERE name = ?");
    // Exécuter la requête avec le nom fourni
    const tournament = stmt.get(name);
    
    // Si un tournoi avec ce nom est trouvé, renvoyer true
    if (tournament) {
      return true;
    }
    // Sinon, renvoyer false
    return false;
  };
  
  





   





