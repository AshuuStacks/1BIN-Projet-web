const db = require("./db_conf.js");

module.exports.info = (receiver_id) => {
    const stmt = db.prepare("SELECT * FROM messages , users WHERE user_id = sender_id AND receiver_id=?");
    return stmt.all(receiver_id);
}

module.exports.findById = (message_id,user_id) => {
    const stmt = db.prepare("SELECT * FROM messages WHERE message_id = ? , user_id = ?");
    return stmt.get(message_id,user_id);
};

module.exports.getReceiver = () => {
    const stmt = db.prepare("SELECT * FROM  messages , users WHERE user_id = receiver_id");
    return stmt.get();
}

module.exports.save = (message_id,sender_id,receiver_id,message_text,response_text,date_hour_message) => {
    const stmt = db.prepare("INSERT INTO messages (message_id , sender_id , receiver_id ,response_text,date_hour_message) VALUES (?, ?, ?, ?, ?)");
    const info = stmt.run(message_id,sender_id,receiver_id,message_text,response_text,date_hour_message);
};
