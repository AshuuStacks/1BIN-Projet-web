const db = require("./db_conf.js");

module.exports.info = () => {
    const stmt = db.prepare("SELECT * FROM tennis_courts ORDER BY name");
    return stmt.all();
};

module.exports.select = () => {
    const stmt = db.prepare("SELECT COUNT(*) AS total FROM bookings WHERE date_booking > date('now');");
    return stmt.get();
}

module.exports.findById = (court_id) => {
    const stmt = db.prepare("SELECT * FROM tennis_courts WHERE tennis_court_id = ?");
    const result = stmt.get(court_id);
    return result;
};

module.exports.update = (tennis_court_id, name, flooring_type, location, picture_path) => {
    const stmt = db.prepare("UPDATE tennis_courts SET name = ?, flooring_type = ?, location = ?, picture_path = ? WHERE tennis_court_id = ?");
    const result = stmt.run(name, flooring_type, location, picture_path, tennis_court_id);
    return result;
};

module.exports.getBookings = (user_id) => {
    const stmt = db.prepare("SELECT * FROM bookings WHERE user_id = ? ORDER BY date_booking");
    return stmt.all(user_id);
};

module.exports.book = (date_booking, tennis_court_id, user_id) => {
    const stmt = db.prepare("INSERT INTO bookings (date_booking, tennis_court_id, user_id) VALUES (?, ?, ?)");
    const result = stmt.run(date_booking, tennis_court_id, user_id);
    return result
}
module.exports.findByDateAndCourt = (date_booking, tennis_court_id) => {
    const stmt = db.prepare("SELECT * FROM bookings WHERE date_booking = ? AND tennis_court_id = ?");
    const result = stmt.get(date_booking, tennis_court_id);
    return result;
};


module.exports.unbook = (tennis_court_id, date_booking) => {
    const stmt = db.prepare("DELETE FROM bookings WHERE tennis_court_id = ? AND date_booking = ?");
    const result = stmt.run(tennis_court_id, date_booking);
    return result;
};


