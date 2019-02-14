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
            'can_subscribe boolean not null check(can_subscribe in(0, 1)), ' +
            'starts_at datetime not null)',
    );

    // activities data
    db.run('DELETE FROM activities');

    db.run(
        'INSERT INTO activities VALUES ' +
            '(1, ' +
            "'Tournament: Xonotic', " +
            "'Main room, Saturday at 12:00', " +
            '1,' +
            "'2019-02-16 12:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
            '(2, ' +
            "'Tournament: Keep Talking and Nobody Explodes', " +
            "'Main room stage, Saturday at 16:00', " +
            '1,' +
            "'2019-02-16 16:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
            '(3, ' +
            "'Dinner: Fries & Snacks', " +
            "'Courtyard, Saturday at 19:00', " +
            '0,' +
            "'2019-02-16 19:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
            '(4, ' +
            "'Tournament: Just Dance', " +
            "'Downstairs lounge, Saturday at 23:00', " +
            '1,' +
            "'2019-02-16 23:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
            '(5, ' +
            "'Tournament: Rocket League', " +
            "'Main room, Sunday at 12:00', " +
            '1,' +
            "'2019-02-17 12:00:00')",
    );

    db.run(
        'CREATE TABLE IF NOT EXISTS subscriptions ' +
            '(id integer not null primary key autoincrement, ' +
            'activity_id inter not null,' +
            'hostname varchar not null,' +
            'FOREIGN KEY (activity_id) REFERENCES activities(id), ' +
            'UNIQUE(activity_id, hostname))',
    );

    db.run(
        'CREATE TABLE IF NOT EXISTS nicknames ' +
            '(hostname varchar not null primary key, ' +
            'nick varchar not null)',
    );

    // set the activities sequence correctly
    db.run('DELETE FROM sqlite_sequence');
    db.run("INSERT INTO sqlite_sequence VALUES ('activities', 5)");

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
