const db = require("./db_conf.js");

module.exports.info = () => {
    const stmt = db.prepare("SELECT * FROM messages");
    return stmt.all();
}

module.exports.findById = (message_id) => {
    const stmt = db.prepare("SELECT * FROM messages WHERE message_id = ?");
    return stmt.get(message_id);
};
