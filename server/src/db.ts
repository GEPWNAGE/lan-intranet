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
        "'Monday at 19:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2020-03-16 19:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(2, ' +
        "'Competition: Dota Underlords', " +
        "'At your home', " +
        "'static/images/dota-underlords.png', " +
        `'Play the newly released chess-based auto battler Dota Underlords
            with us!.', ` +
        '1,' +
        "'2020-03-16 20:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(3, ' +
        "'Competition: Jackbox Quiplash', " +
        "'At your home', " +
        "'static/images/mario-kart.png', " +
        `'We''ll be having a night of fun with Quiplash, the Jackbox party game. Everyone can join in with their smartphone!', ` +
        '1,' +
        "'2020-03-17 20:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(4, ' +
        "'Competition: CS: GO 2v2', " +
        "'At your home', " +
        "'static/images/dota-underlords.png', " +
        `'Shoot your way to the top with the popular and fast-paced shooter CS:GO!',` +
        '1,' +
        "'2020-03-18 20:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(5, ' +
        "'Competition: skribbl.io', " +
        "'At your home', " +
        "'static/images/just-dance-2020.png', " +
        `'Can you draw quickly? Are you a pro at recognizing other people''s drawings? Then join our skribbl.io competition!', ` +
        '1,' +
        "'2020-03-19 20:00:00')"
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(6, ' +
        "'Competition: Plague Inc.', " +
        "'At your home', " +
        "'static/images/just-dance-2020.png', " +
        `'Can you beat the coronavirus? Are you better at infecting people? Play Plague Inc. and show off your best killer-virus.', ` +
        '1,' +
        "'2020-03-20 20:00:00')"
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(7, ' +
        "'End of the ELAN', " +
        "'Friday at 23:59', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2020-03-20 23:59:59')"
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
