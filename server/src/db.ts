import sqlite3, { RunResult, Statement } from 'sqlite3';
import { promisify } from 'util';

const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
    db.run('PRAGMA foreign_keys=OFF');
    db.run('BEGIN TRANSACTION');

    // shoutbox
    db.run(
        'CREATE TABLE IF NOT EXISTS shoutbox ' +
            '(id integer not null primary key autoincrement, ' +
            'hostname varchar not null, ' +
            'body text not null, ' +
            'sent_at varchar not null)',
    );

    // activities
    db.run(
        'CREATE TABLE IF NOT EXISTS activities ' +
            '(id integer not null primary key autoincrement, ' +
            'title varchar not null, ' +
            'details varchar not null, ' +
            'header text not null, ' +
            'description text not null, ' +
            'can_subscribe boolean not null check(can_subscribe in(0, 1)), ' +
            'starts_at datetime not null)',
    );

    // activities data
    db.run('DELETE FROM activities');

    db.run(
        'INSERT INTO activities VALUES ' +
        '(1, ' +
        "'Official Opening', " +
        "'Saturday at 0:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2020-03-07 00:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(2, ' +
        "'Competition: Minecraft', " +
        "'Main room, the entire weekend', " +
        "'static/images/minecraft.png', " +
        `'Show off your creativity in the Minecraft competition! Everyone will
               work in creative mode, to create the best models. The theme will
               be announced at the start of the competition!', ` +
        '1,' +
        "'2020-03-06 17:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(3, ' +
        "'Competition: Mario Kart Switch', " +
        "'Downstairs lounge, Friday at 21:00', " +
        "'static/images/xonotic.jpg', " +
        `'Race like a pro on Mario Kart for the Switch. Show your skills in
            navigating the racetrack. No prior skills required, fun for
            everyone guaranteed. Watch out for blue shells!', ` +
        '1,' +
        "'2020-03-06 21:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(4, ' +
        "'Competition: Dota Underlords', " +
        "'Main room stage, Saturday at 13:30', " +
        "'static/images/minecraft.png', " +
        `'Play the newly released chess-based auto battler Dota Underlords
            with us!',` +
        '1,' +
        "'2020-03-07 13:30:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(5, ' +
        "'Dinner: Fries & Snacks', " +
        "'Courtyard, Saturday at 19:00', " +
        "'', " +
        "'', " +
        '0,' +
        "'2020-03-07 19:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(6, ' +
        "'Competition: Just Dance', " +
        "'Downstairs lounge, Sunday at 0:00', " +
        "'static/images/just-dance.png', " +
        `'Show off your dance moves with Just Dance 2020, the ultimate
                party game with several hot tracks from chart-topping hits to
                family favorites, including "10.000 Luchtballonnen" by K3,
                "Bangarang" by Skrillex (Ft. Sirah),
                "Everybody (Backstreet''s back)" by the Backstreet Boys and more!', ` +
        '1,' +
        "'2020-03-08 00:00:00')"
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(7, ' +
        "'End of the LAN', " +
        "'Sunday at 16:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2020-03-08 16:00:00')"
    );

    db.run(
        'CREATE TABLE IF NOT EXISTS subscriptions ' +
            '(id integer not null primary key autoincrement, ' +
            'activity_id integer not null,' +
            'hostname varchar not null,' +
            'FOREIGN KEY (activity_id) REFERENCES activities(id), ' +
            'UNIQUE(activity_id, hostname))',
    );

    db.run(
        'CREATE TABLE IF NOT EXISTS nicknames ' +
            '(hostname varchar not null primary key, ' +
            'nick varchar not null)',
    );

    db.run(
        'CREATE TABLE IF NOT EXISTS challenge ' +
            '(id integer not null primary key autoincrement, ' +
            'game varchar not null, ' +
            'best varchar nut null)'
    );

    // insert new challenges
    db.run(
        'INSERT OR IGNORE INTO challenge VALUES ' +
        '(1, ' +
        "'Just Dance', " +
        "'Nadym van Schaik')"
    );
    db.run(
        'INSERT OR IGNORE INTO challenge VALUES ' +
        '(2, ' +
        "'F1 2017', " +
        "'Koen Klaren')"
    );
    db.run(
        'INSERT OR IGNORE INTO challenge VALUES ' +
        '(3, ' +
        "'Super Hexagon', " +
        "'Mitchel Brunings')"
    );
    db.run(
        'INSERT OR IGNORE INTO challenge VALUES ' +
        '(4, ' +
        "'Command & Conquer: Generals (with zero hour expansion)', " +
        "'Kevin Jilissen')"
    );
    db.run(
        'INSERT OR IGNORE INTO challenge VALUES ' +
        '(5, ' +
        "'Total Annihilation', " +
        "'Pieter Kokx')"
    );
    db.run(
        'INSERT OR IGNORE INTO challenge VALUES ' +
        '(6, ' +
        "'OpenTTD', " +
        "'Marcin van de Ven')"
    );
    db.run(
        'INSERT OR IGNORE INTO challenge VALUES ' +
        '(7, ' +
        "'CS:GO 1v1 with racing wheel', " +
        "'Max Langerak')"
    );
    db.run(
        'INSERT OR IGNORE INTO challenge VALUES ' +
        '(8, ' +
        "'Super Smash Bros Melee', " +
        "'Dante Spekken')"
    );
    db.run(
        'INSERT OR IGNORE INTO challenge VALUES ' +
        '(9, ' +
        "'Trackmania', " +
        "'Mark van Helvoort')"
    );
    db.run(
        'INSERT OR IGNORE INTO challenge VALUES ' +
        '(10, ' +
        "'Smite 1v1', " +
        "'Steven Miltenburg')"
    );
    db.run(
        'INSERT OR IGNORE INTO challenge VALUES ' +
        '(11, ' +
        "'Captain Sonar 2v2', " +
        "'Henk Alkema & Steven Miltenburg')"
    );


    db.run(
        'CREATE TABLE IF NOT EXISTS logins ' +
            '(id integer not null primary key autoincrement, ' +
            'login varchar not null, ' +
            'hash varchar nut null, ' +
            'UNIQUE(login))'
    );


    // set the activities and challenge sequence correctly
    db.run('DELETE FROM sqlite_sequence');
    db.run("INSERT INTO sqlite_sequence VALUES ('activities', 7)");
    db.run("INSERT INTO sqlite_sequence VALUES ('challenge', 7)");

    db.run('COMMIT');
});

export default db;

// Export promisified methods
interface All {
    (sql: string): Promise<any[]>;
    (sql: string, ...params: any[]): Promise<any[]>;
}
export const dbAll: All = promisify(db.all.bind(db));

interface Run {
    (sql: string): Promise<RunResult>;
    (sql: string, ...params: any[]): Promise<RunResult>;
}
// @ts-ignore
db.run[promisify.custom] = (...params: any[]) => new Promise((resolve, reject) => {
    // @ts-ignore
    db.run(...params, function (err) {
        if (err) return reject(err);
        resolve(this);
    });
});
export const dbRun: Run = promisify(db.run);

interface Get {
    (sql: string): Promise<any>;
    (sql: string, ...params: any[]): Promise<any>;
}
export const dbGet: Get = promisify(db.get.bind(db));
