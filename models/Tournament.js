const db = require('../models/db_conf');


module.exports.list = () => {
    return db.prepare("SELECT * FROM tournaments").all();
};


module.exports.findById = (id) => {
    return db.prepare("SELECT * FROM tournaments WHERE tournament_id = ?").get(id);
};

