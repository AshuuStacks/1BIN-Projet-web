const db = require("./db_conf.js");

module.exports.select = () => {
    const stmt = db.prepare("SELECT COUNT(message_id) AS total FROM messages WHERE date_hour_message >= datetime('now', '-7 days')");
    return stmt.get();
};

module.exports.info = (isRegular) => {
    const stmt = db.prepare("SELECT * FROM messages ORDER BY date_hour_message DESC ");
    const msgs = stmt.all();
    if (isRegular) {
        // Si c'est un utilisateur normal, remplacer receiver_id par nom du coach
        for (let i = 0; i < msgs.length; i++) {
            const coach = db.prepare("SELECT firstname FROM users WHERE user_id = ?");
            const coachName = coach.get(msgs[i].receiver_id);
            msgs[i].receiver_id = coachName.firstname;
        }
    
    } else {
        // Si c'est un coach, remplacer sender_id par nom de l'utilisateur
        for (let i = 0; i < msgs.length; i++) {
            const user = db.prepare("SELECT firstname FROM users WHERE user_id = ?");
            const userName = user.get(msgs[i].sender_id);
            msgs[i].sender_id = userName.firstname;
        }
    }
    return msgs;
}

module.exports.findById = (message_id) => {
    const stmt = db.prepare("SELECT * FROM messages WHERE message_id = ?");
    return stmt.get(message_id);
};

module.exports.updateResponseText = (message_id, response_text) => {
    const stmt = db.prepare("UPDATE messages SET response_text = ? WHERE message_id = ? AND response_text IS NULL");
    const info = stmt.run(response_text, message_id);
    return info.changes; // Cela retournera le nombre de lignes mises à jour
};


module.exports.countMessage = (receiver_id) => {
    const stmt = db.prepare("SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND response_text IS NULL ");
    const result = stmt.get(receiver_id);
    return result.count;
}

module.exports.countMessageSender = (sender_id) => {
    const stmt = db.prepare("SELECT COUNT(*) as count FROM messages WHERE sender_id = ? AND message_text IS NOT NULL ");
    const result = stmt.get(sender_id);
    return result.count;
}