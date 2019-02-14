import { Router } from 'express';

import { dbAll, dbGet, dbRun } from '../db';
import {
    getHostnameFromIp,
    getNickFromHostname,
    getUsername,
} from '../data/names';
import { ioShoutbox } from '../index';

const router = Router();

router.get('/nick', async (req, res) => {
    const hostname = await getHostnameFromIp(req);
    const nickname = await getNickFromHostname(hostname);

    res.json({
        nick: nickname,
        hostname,
    });
});

router.post('/nick', async (req, res) => {
    if (req.body.nick === undefined || typeof req.body.nick !== 'string') {
        res.status(400).json({ error: 'No nick given' });
        return;
    }

    let nick: string = req.body.nick;

    if (nick.length > 32) {
        nick = nick.substr(0, 32);
    }

    // get the hostname
    const hostname: string = await getHostnameFromIp(req);

    try {
        // check if we already have a username
        const rows = await dbAll(
            'SELECT hostname FROM nicknames WHERE hostname = ?',
            [hostname],
        );

        if (rows.length > 0) {
            await dbRun('UPDATE nicknames SET nick = ? WHERE hostname = ?', [
                nick,
                hostname,
            ]);
            res.json('Nickname updated');
        } else {
            await dbRun('INSERT INTO nicknames VALUES (?, ?)', [
                hostname,
                nick,
            ]);
            res.json('Nickname created');
        }
    } catch (err) {
        console.log(err);
        return;
    }
});

router.get('/shoutbox', async (req, res) => {
    // for now, we simply do not allow scroll back, just send the last 20 messages
    // TODO: obtain the nickname in the query
    const sql =
        'SELECT s.id, s.hostname, s.body, s.sent_at, n.nick FROM shoutbox AS s ' +
        'LEFT JOIN nicknames AS n ON (s.hostname = n.hostname) ' +
        'ORDER BY id DESC LIMIT 20';

    try {
        const rows = await dbAll(sql);

        const messages = rows.map((row) => ({
            id: row.id,
            nick: row.nick,
            username:
                row.nick !== null
                    ? row.nick + ' [' + row.hostname + ']'
                    : row.hostname,
            hostname: row.hostname,
            body: row.body,
            time: row.sent_at,
        }));

        res.json({ messages });
    } catch (err) {
        console.log(err);
        return;
    }
});

router.post('/shoutbox', async (req, res) => {
    if (req.body.body === undefined || typeof req.body.body !== 'string') {
        res.status(400).json({ error: 'No message given' });
        return;
    }

    const hostname = await getHostnameFromIp(req);
    sendMessage(hostname, req.body.body);
    res.json('Message sent');
});

router.get('/activities', async (req, res) => {
    const sql =
        "SELECT id, title, details, can_subscribe, starts_at FROM activities WHERE starts_at > datetime('now')";

    try {
        const activities = await dbAll(sql);
        res.json({ activities });
    } catch (err) {
        console.log(err);
        return;
    }
});

router.get(
    '/activities/:activityId([0-9]+)/subscriptions',
    async (req, res) => {
        if (req.params.activityId === undefined) {
            res.status(400).json({ error: 'No activity specified' });
            return;
        }
        let activityId = parseInt(req.params.activityId, 10);

        const sql =
            'SELECT id, activity_id, hostname FROM subscriptions WHERE activity_id = ?';

        try {
            const subscriptions = dbAll(sql, [activityId]);
            res.json({ subscriptions });
        } catch (err) {
            console.log(err);
            return;
        }
    },
);

router.post(
    '/activities/:activityId([0-9]+)/subscriptions',
    async (req, res) => {
        if (req.params.activityId === undefined) {
            res.status(400).json({ error: 'No activity specified' });
            return;
        }
        let activityId = parseInt(req.params.activityId, 10);

        try {
            const row = await dbGet(
                'SELECT id, can_subscribe FROM activities WHERE id = ?',
                [activityId],
            );

            if (row.can_subscribe != 1) {
                res.status(403).json({
                    error: 'Cannot subscribe to this activity',
                });
                return;
            }

            // get the hostname and insert
            const hostname = await getHostnameFromIp(req);

            try {
                await dbRun('INSERT INTO subscriptions VALUES (NULL, ?, ?)', [
                    activityId,
                    hostname,
                ]);
                res.json('Subscribed to activity');
            } catch (err) {
                res.status(400).json({ error: 'Already subscribed' });
                return;
            }
        } catch (err) {
            console.log(err);
            return;
        }
    },
);

async function sendMessage(hostname: string, body: string, time = new Date()) {
    // save the message in the database
    const sql =
        'INSERT INTO shoutbox (id, hostname, body, sent_at) VALUES (NULL, ?, ?, ?)';

    try {
        const { lastID } = await dbRun(sql, [hostname, body, time.toJSON()]);
        const nick = await getNickFromHostname(hostname);
        const username = getUsername(nick, hostname);

        // emit the message to the shoutbox
        const message = {
            id: lastID,
            nick,
            username,
            hostname,
            body,
            time,
        };
        ioShoutbox.emit('shoutbox message', message);
    } catch (err) {
        console.log('SQLite error!', err);
        return;
    }
}

export default router;
