import { dbRun } from '../src/db';
import bcrypt from 'bcrypt';
import rl from 'readline-sync';
import { Writable } from 'stream';

(async () => {
    const username = rl.question('Username: ');
    const password = rl.question('Password: ', {
        hideEchoBack: true
    });

    const hashed = await bcrypt.hash(password, 11);

    const sql = 'INSERT INTO logins (login, hash) VALUES (?, ?)';

    await dbRun(sql, [username, hashed]);

    console.log('Created');
})();
