import sqlite3, { RunResult, Statement } from 'sqlite3';
import { promisify } from 'util';

const paintdb = new sqlite3.Database('paintdb.sqlite');

paintdb.serialize(() => {
    paintdb.run('PRAGMA foreign_keys=OFF');
    paintdb.run('BEGIN TRANSACTION');

    // paintdb
    paintdb.run(
        'CREATE TABLE IF NOT EXISTS grid ' +
            '(x integer not null, ' +
            'y integer not null, ' +
            'color varchar not null, ' +
            'primary key (x, y))'
    );

    for (let x = 0; x < 128; x++) {
        for (let y = 0; y < 128; y++) {
            paintdb.run(
                'INSERT OR IGNORE INTO grid VALUES ' +
                '(' + x + ', ' + y + ", '#013370')"
            );
        }
    }

    paintdb.run('COMMIT');
});

export default paintdb;

// Export promisified methods
interface All {
    (sql: string): Promise<any[]>;
    (sql: string, ...params: any[]): Promise<any[]>;
}
export const paintdbAll: All = promisify(paintdb.all.bind(paintdb));

interface Run {
    (sql: string): Promise<RunResult>;
    (sql: string, ...params: any[]): Promise<RunResult>;
}
// @ts-ignore
paintdb.run[promisify.custom] = (...params: any[]) => new Promise((resolve, reject) => {
    // @ts-ignore
    paintdb.run(...params, function (err) {
        if (err) return reject(err);
        resolve(this);
    });
});
export const paintdbRun: Run = promisify(paintdb.run);

interface Get {
    (sql: string): Promise<any>;
    (sql: string, ...params: any[]): Promise<any>;
}
export const paintdbGet: Get = promisify(paintdb.get.bind(paintdb));
