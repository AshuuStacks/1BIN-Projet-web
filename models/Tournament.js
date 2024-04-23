const db = require('../models/db_conf');

/*new Date() creates a new Date object representing the current date and time.
.toISOString() converts this Date object into a string in ISO 8601 format, which looks like this: 'YYYY-MM-DDTHH:mm:ss.sssZ'.
.split('T')[0] splits this string into two parts using the 'T' character as a separator and retrieves only the first part, which is the date in the format 'YYYY-MM-DD'.
const currentDate stores this date in the 'YYYY-MM-DD' format.
*/
module.exports.list = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const stmt_all = db.prepare("SELECT * FROM tournaments WHERE date_tournament >= ? ORDER BY date_tournament");
    return stmt_all.all(currentDate);
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


module.exports.select= (userId, tournamentId) => {
    const stmt_select = db.prepare("SELECT COUNT(t.*) FROM tournaments t WHERE t.date_tournament > currentDate");
    stmt_select.run(userId, tournamentId);
};


   





