-- TODO remplacer ce fichier par la version française ou anglaise selon la langue choisie

DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS tournaments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tennis_courts;

CREATE TABLE users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);