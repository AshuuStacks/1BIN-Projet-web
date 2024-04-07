const db = require("./db_conf.js");

module.exports.save = (firstname, surname, email, password, status) => {
    const stmt = db.prepare("INSERT INTO users (firstname, surname, email, password, status) VALUES (?, ?, ?, ?, ?)");
    const info = stmt.run(firstname, surname, email, password, status);
};

module.exports.info = () => {
    const stmt = db.prepare("SELECT * FROM messages , users WHERE user_id = sender_id");
    return stmt.all();
}

module.exports.findById = (message_id,user_id) => {
    const stmt = db.prepare("SELECT * FROM messages WHERE message_id = ? , user_id = ?");
    return stmt.get(message_id,user_id);
};

