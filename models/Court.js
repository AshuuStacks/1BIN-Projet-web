const db = require("./db_conf.js");

module.exports.info = () => {
    const stmt = db.prepare("SELECT * FROM tennis_courts");
    return stmt.all();
};

module.exports.findById = (court_id) => {
    const stmt = db.prepare("SELECT * FROM tennis_courts WHERE tennis_court_id = ?");
    return stmt.get(court_id);
};


module.exports.update = (tennis_court_id, name, flooring_type, location, picture_path) => {
    const stmt = db.prepare("UPDATE tennis_courts SET name = ?, flooring_type = ?, location = ?, picture_path = ? WHERE tennis_court_id = ?");
    stmt.run(name, flooring_type, location, picture_path, tennis_court_id);
};