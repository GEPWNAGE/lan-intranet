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
        "'Start', " +
        "'Friday at 15:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2023-02-24 15:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(2, ' +
        "'Dinner', " +
        "'Friday at 19:30', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2023-02-24 19:30:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(3, ' +
        "'Just Dance Competition', " +
        "'Friday at 20:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2023-02-24 20:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(4, ' +
        "'Last round', " +
        "'Friday at 23:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2023-02-24 23:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(5, ' +
        "'Go home :(', " +
        "'Friday at 23:30', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2023-02-24 23:30:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(6, ' +
        "'Breakfast', " +
        "'Saturday at 9:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2023-02-25 9:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(7, ' +
        "'Lunch', " +
        "'Saturday at 12:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2023-02-25 12:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(8, ' +
        "'Smash Competition', " +
        "'Saturday at 14:00', " +
        "'', " +
        `'', ` +
        '1,' +
        "'2023-02-25 14:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(9, ' +
        "'Minecraft Competition (part 1)', " +
        "'Saturday at 16:00', " +
        "'', " +
        `'', ` +
        '1,' +
        "'2023-02-25 16:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(10, ' +
        "'Dinner', " +
        "'Saturday at 19:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2023-02-25 19:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(11, ' +
        "'League of Legends competition', " +
        "'Saturday at 20:00', " +
        "'', " +
        `'', ` +
        '1,' +
        "'2023-02-25 20:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(12, ' +
        "'Last round', " +
        "'Saturday at 23:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2023-02-25 23:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(13, ' +
        "'Go home :(', " +
        "'Saturday at 23:30', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2023-02-25 23:30:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(14, ' +
        "'Start', " +
        "'Sunday at 9:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2023-02-26 9:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(15, ' +
        "'Brunch', " +
        "'Sunday at 10:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2023-02-26 10:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(16, ' +
        "'Minecraft Competition (part 2)', " +
        "'Sunday at 11:00', " +
        "'', " +
        `'', ` +
        '1,' +
        "'2023-02-26 11:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(17, ' +
        "'The End :(', " +
        "'Sunday at 15:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2023-02-26 15:00:00')",
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
