const db = require("./db_conf.js");

module.exports.info = () => {
    const stmt = db.prepare("SELECT * FROM messages");
    return stmt.all();
}

module.exports.findById = (message_id) => {
    const stmt = db.prepare("SELECT * FROM messages WHERE message_id = ?");
    return stmt.get(message_id);
};

    



module.exports.save = (message_id,sender_id,receiver_id,message_text,response_text,date_hour_message) => {
    const stmt = db.prepare("INSERT INTO messages (message_id , sender_id , receiver_id ,response_text,date_hour_message) VALUES (?, ?, ?, ?, ?)");
    const info = stmt.run(message_id,sender_id,receiver_id,message_text,response_text,date_hour_message);
};
