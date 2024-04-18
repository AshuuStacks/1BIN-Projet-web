const db = require("./db_conf.js");

module.exports.info = () => {
    const stmt = db.prepare("SELECT * FROM users WHERE status='coach' ORDER BY surname");
    return stmt.all();
}

module.exports.findById = (user_id) => {
    const stmt = db.prepare("SELECT * FROM users WHERE user_id = ?");
    return stmt.get(user_id);
};

module.exports.update = (user_id, biography, picture_path) => {
    const stmt = db.prepare("UPDATE users SET biography = ?, picture_path = ? WHERE user_id = ?");
    const result = stmt.run(biography, picture_path, user_id);
    return result;
};

module.exports.list = () => {
    const listmsg = db.prepare("SELECT message_id from messages");
    return listmsg.all;
   }

module.exports.push = (message) => {
    const stmt = db.prepare("INSERT INTO messages (message_text, date_hour_message ,message_id , sender_id , receiver_id ) VALUES (?, ?, ?, ?, ?)");
    const info = stmt.run(message.message_id, message.sender_id,  message.receiver_id, message.message_text, message.date_hour_message);
};
