const db = require("./db_conf.js");

module.exports.info = (isRegular) => {
    const stmt = db.prepare("SELECT * FROM messages");
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

