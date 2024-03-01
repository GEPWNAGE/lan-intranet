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
        "'2024-03-01 18:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(2, ' +
        "'Dinner', " +
        "'Friday at 20:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2024-03-01 20:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(3, ' +
        "'Opening 2009scape Competition', " +
        "'Friday at 22:00', " +
        "'static/images/2009scape.png', " +
        `'Let us take you back to 2009 with this classic RPG: RuneScape! We''ll be playing on our private server during the entire LAN party! Don''t worry about not having enough time to level up, as xp rates are drastically increased. Show up in a Rune Platebody before the end to earn your certificate of awesomeness!', ` +
        '1,' +
        "'2024-03-01 22:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(4, ' +
        "'Just Dance Competition', " +
        "'Saturday at 1:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2024-03-02 1:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(5, ' +
        "'Starcraft II Competition', " +
        "'Saturday at 13:00', " +
        "'static/images/starcraft-ii.png', " +
        `'Embark on a challenging Starcraft 2 journey where completing four selected missions is your key to victory. Here''s the twist: no unit construction or upgrades are allowed unless you accomplishe a side quest or reach a mission checkpoint. Feel free to restart missions to unlock additional resources. The ultimate triumph awaits the first strategist who conquers the final mission. Are you up for the challenge?', ` +
        '1,' +
        "'2024-03-02 13:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(6, ' +
        "'Dinner', " +
        "'Saturday at 19:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2024-03-02 19:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(7, ' +
        "'Sims 4 Competition', " +
        "'Saturday at 21:00', " +
        "'static/images/sims-4.png', " +
        `'Unleash your inner architect as the clock ticks down! You have just one hour to craft the most stunning masterpiece. Let your imagination run wild, but don''t forget the devil''s in the details – a panel of judges awaits to crown the ultimate creator. Remember, stick to the rules: one hour, base game only. Good luck, and may the most breathtaking build win!', ` +
        '1,' +
        "'2024-03-02 21:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(8, ' +
        "'Stick Fight Competition', " +
        "'Sunday at 1:00', " +
        "'static/images/stick-fight.png', " +
        `'Enter the arena of Stick Fight: The ultimate battle where victory is everything. Engage in intense rounds against opponents, each one crucial in securing your triumph. Rack up the highest score across multiple rounds to claim ultimate glory. Prepare for adrenaline-pumping action and strategic combat as you fight your way to the top. Can you emerge as the ultimate victor?', ` +
        '1,' +
        "'2024-03-03 1:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(9, ' +
        "'2009scape Competition end', " +
        "'Sunday at 10:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2024-03-03 10:00:00')",
    );

    db.run(
        'INSERT INTO activities VALUES ' +
        '(10, ' +
        "'The End :(', " +
        "'Sunday at 11:00', " +
        "'', " +
        `'', ` +
        '0,' +
        "'2024-03-03 11:00:00')",
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
