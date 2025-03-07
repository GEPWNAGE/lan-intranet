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
        "'2025-03-07 18:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(2, ' +
        "'Dinner', " +
        "'Friday at 20:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2024-03-07 20:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(3, ' +
        "'Ticket to Ride compo', " +
        "'Friday at 22:00', " +
        "'static/images/tickettoride.png', " +
        `'I like trains, choo choo!\nDo you also like trains or like to manage tracks? Play three variants of ticket to ride, namely, ticket to ride Amsterdam, ticket to ride new Amsterdam/new york and english Amsterdam/London, get the highest score and win fun price 🚂🚅🚋🚕', ` +
        '1,' +
        "'2024-03-07 22:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(4, ' +
        "'Among us Competition', " +
        "'Saturday at 1:00', " +
        "'static/images/amongus.png'   , " +
        `'There is an imposter among us!\nLook around you, everyone is acting sus... Forge trust and eject the right crew members from the LAN party.', ` +
        '1,' +
        "'2024-03-08 1:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(5, ' +
        "'Keep talking and nobody explodes Competition', " +
        "'Saturday at 13:00', " +
        "'static/images/keeptalking.png', " +
        `'Keep talking and nobody explodes! Will you Putin the effort to Trump the other teams? We''ll Xi you there!\nIn this competition you can form teams of up to 4 people. One person to defuse the bomb, and the others to solve the puzzles. We will provide the bombs, bomb manuals, and pen and paper. There will be time to practice before the competition. During the competition itself, we will have some custom bombs. Each team that explodes is eliminated. Last team standing wins :) (Ties will be resolved by more bombs.)', ` +
        '1,' +
        "'2024-03-08 13:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(6, ' +
        "'Dinner', " +
        "'Saturday at 19:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2024-03-08 19:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(7, ' +
        "'Zombies Competition', " +
        "'Saturday at 21:00', " +
        "'static/images/nzpzombies.png', " +
        `'The dead have risen again, and it''s up to your squad to defeat them!\nGather a squad of 3 soldiers and save the world from the Nazi Zombie Apocalypse. The classic retro game mode (do you feel old already?) of CoD is now brought to you in your web browser. The team surviving the most waves of zombies wins. Grab a refreshing Perk-A-Cola and gear up now!', ` +
        '1,' +
        "'2024-03-08 21:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(8, ' +
        "'The End :(', " +
        "'Sunday at 11:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2024-03-09 11:00:00')",
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
