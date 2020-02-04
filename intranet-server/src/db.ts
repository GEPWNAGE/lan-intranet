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
        "'Competition: TBA', " +
        "'Main room, Saturday at 12:00', " +
        "'static/images/xonotic.jpg', " +
        `'Shoot yourself to the top with Xonotic 1v1, an addictive
                arena-style first person shooter with crisp movement
                and a wide array of weapons. It combines intuitive
                mechanics with in-your-face action to elevate your
                heart rate. BEST OF ALL IT''S FREE.', ` +
        '1,' +
        "'2020-03-07 12:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(3, ' +
        "'Competition: TBA', " +
        "'Main room stage, Saturday at 16:00', " +
        "'static/images/keep-talking.png', " +
        `'We will provide the game and bomb defusal manuals. You
                provide a team of 2 to 4 people and a very specific set
                of skills. (Personalized bomb defusal manuals are
                allowed.)', ` +
        '1,' +
        "'2020-03-07 16:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(4, ' +
        "'Dinner: Fries & Snacks', " +
        "'Courtyard, Saturday at 19:00', " +
        "'', " +
        "'', " +
        '0,' +
        "'2020-03-07 19:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(5, ' +
        "'Competition: Just Dance', " +
        "'Downstairs lounge, Saturday at 23:00', " +
        "'static/images/just-dance.png', " +
        `'Show off your dance moves with Just Dance 2019, the ultimate
                party game with 40 hot tracks from chart-topping hits to
                family favorites, including "Finesse (Remix)" by Bruno
                Mars Ft. Cardi B., "Bang Bang Bang" by BIGBANG,
                "Shaky Shaky" by Daddy Yankee and more!', ` +
        '1,' +
        "'2020-03-07 23:00:00')"
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(6, ' +
        "'Competition: TBA', " +
        "'Main room, Sunday at 12:00', " +
        "'static/images/rocket-league.jpg', " +
        `'You will be playing 2v2 soccar matches on a LAN server in a
                double-elimination tournament. Please make sure you have
                a copy of the game installed on your system!', ` +
        '1,' +
        "'2020-03-08 12:00:00')"
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(7, ' +
        "'End of the LAN', " +
        "'Sunday at 16:00', " +
        "'static/images/rocket-league.jpg', " +
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



    // set the activities and challenge sequence correctly
    db.run('DELETE FROM sqlite_sequence');
    db.run("INSERT INTO sqlite_sequence VALUES ('activities', 7)");
    db.run("INSERT INTO sqlite_sequence VALUES ('challenge', 3)");

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
