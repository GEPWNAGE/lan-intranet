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
        "'Friday at 18:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2026-02-20 18:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(2, ' +
        "'Dinner', " +
        "'Friday at 20:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2026-02-20 20:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(3, ' +
        "'Worms Competition', " +
        "'Friday at 23:00', " +
        "'static/images/worms-wmd.jpg', " +
        `'', ` +
        '1,' +
        "'2026-02-20 23:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(4, ' +
        "'Counter Strike 2 Competition', " +
        "'Saturday at 13:00', " +
        "'static/images/counter-strike-2.png', " +
        `'', ` +
        '1,' +
        "'2026-02-21 13:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(5, ' +
        "'Dinner', " +
        "'Saturday at 19:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2026-02-21 19:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(6, ' +
        "'Mario Krat Competition', " +
        "'Saturday at 21:00', " +
        "'static/images/mario-krat.png', " +
        `'Do you like playing Mario kart with your friends and are looking to add another layer of fun? Are your friends tired of you always winning and want to make it more difficult for you? Or are you just looking for an excuse to drink? Then join the Mario krat tournament! Alcohol free version is also possible', ` +
        '1,' +
        "'2026-02-21 21:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(7, ' +
        "'Sky Block Competition Finale', " +
        "'Sunday at 11:00', " +
        "'static/images/sky-block.png', " +
        `'', ` +
        '1,' +
        "'2026-02-22 11:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(8, ' +
        "'The End :(', " +
        "'Sunday at 12:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2026-02-22 12:00:00')",
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
