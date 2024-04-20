const db = require('../models/db_conf');


module.exports.list = () => {
   const currentDate = new Date().toISOString().split('T')[0]
   const stmt_all = db.prepare("SELECT * FROM tournaments WHERE date_tournament >= ? ORDER BY date_tournament ");
   return stmt_all.all(currentDate);
};


module.exports.findById = (id) => {
    return db.prepare("SELECT * FROM tournaments WHERE tournament_id = ?").get(id);
};


module.exports.save = (tournamentDetails) => {
    const stmt = db.prepare('INSERT INTO tournaments (name, banner_image_path, date_tournament, nb_max_participants, creator) VALUES (?, ?, ?, ?, ?)');
    stmt.run(tournamentDetails.name, tournamentDetails.banner_image_path, tournamentDetails.date_tournament, tournamentDetails.nb_max_participants, tournamentDetails.creator);
};

// Méthode pour récupérer le nombre d'inscrits à un tournoi spécifique
module.exports.getNumberOfRegistrations = (tournamentId) => {
    const stmt = db.prepare("SELECT COUNT(*) AS count FROM registrations WHERE tournament_id = ?");
    const result = stmt.get(tournamentId);
    return result.count; 
};

// Méthode pour vérifier si l'utilisateur est inscrit au tournoi
module.exports.isregister = (userId, tournamentId) => {
    const stmt_select = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE user_id = ? AND tournament_id = ?');
    const result = stmt_select.get(userId, tournamentId);
    return result.count > 0;
};

// Méthode pour inscrire un utilisateur à un tournoi
module.exports.registerUser = (userId, tournamentId) => {
    // Inscrire l'utilisateur au tournoi
    const stmt_insert = db.prepare('INSERT INTO registrations (user_id, tournament_id) VALUES (?, ?)');
    stmt_insert.run(userId, tournamentId);
};

// Méthode pour désinscrire un utilisateur d'un tournoi
module.exports.unregisterUser = (userId, tournamentId) => {
    const stmt_delete = db.prepare('DELETE FROM registrations WHERE user_id = ? AND tournament_id = ?');
    stmt_delete.run(userId, tournamentId);
};
