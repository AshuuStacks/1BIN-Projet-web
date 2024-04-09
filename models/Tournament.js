const db = require('../models/db_conf');


module.exports.list = () => {
    return db.prepare("SELECT * FROM tournaments").all();
};


module.exports.findById = (id) => {
    return db.prepare("SELECT * FROM tournaments WHERE tournament_id = ?").get(id);
};


module.exports.save = (data) => {
    console.log("SAVE :" + JSON.stringify(data));
    if (data.id === undefined) {
        const stmt = db.prepare('INSERT INTO TOURNAMENTS(name, date_tournament, nb_max_participants, banner_image_path) VALUES (?, ?, ?, ?)');
        const info = stmt.run(data.uniqueNameTournament, data.dateTournament, data.maxPeople, data.filename);
        console.log("tournament save" + info.changes);
    }

};

