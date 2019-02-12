import * as dns from 'dns';
import { Router } from 'express';

import { ioShoutbox } from '../index';
import db from '../db';

const router = Router();

router.get('/nick', (req, res) => {
    getNickAndHostnameFromIp(req.connection.remoteAddress, (nick, hostname) => {
        res.json({ nick, hostname });
    });
});

router.post('/nick', (req, res) => {
    if (req.body.nick === undefined || typeof req.body.nick !== 'string') {
        res.status(400).json({ error: 'No nick given' });
        return;
    }

    const nick = req.body.nick;

    // get the hostnme
    getHostnameFromIp(req.connection.remoteAddress, (hostname) => {
        // check if we already have a username
        const sql = 'SELECT hostname FROM nicknames WHERE hostname = ?';
        db.all(sql, [hostname], (err, rows) => {
            if (err !== null) {
                console.log(err);
                return;
            }

            if (rows.length > 0) {
                const sql = 'UPDATE nicknames SET nick = ? WHERE hostname = ?';
                db.run(sql, [nick, hostname], (err) => {
                    if (err !== null) {
                        console.log(err);
                        return;
                    }

                    res.json('Nickname updated');
                });
            } else {
                const sql = 'INSERT INTO nicknames VALUES (?, ?)';
                db.run(sql, [hostname, nick], (err) => {
                    if (err !== null) {
                        console.log(err);
                        return;
                    }

                    res.json('Nickname created');
                });
            }
        });
    });
});

router.get('/shoutbox', (req, res) => {
    // for now, we simply do not allow scroll back, just send the last 20 messages
    // TODO: obtain the nickname in the query
    const sql =
        'SELECT s.id, s.hostname, s.body, s.sent_at, n.nick FROM shoutbox AS s ' +
        'LEFT JOIN nicknames AS n ON (s.hostname = n.hostname) ' +
        'ORDER BY id ASC LIMIT 20';
    db.all(sql, (err, rows) => {
        if (err !== null) {
            console.log(err);
            return;
        }

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
    });
});

router.post('/shoutbox', (req, res) => {
    if (req.body.body === undefined || typeof req.body.body !== 'string') {
        res.status(400).json({ error: 'No message given' });
        return;
    }

    getHostnameFromIp(req.connection.remoteAddress, (hostname) => {
        sendMessage(hostname, req.body.body);

        res.json('Message sent');
    });
});

router.get('/activities', (req, res) => {
    const sql =
        "SELECT id, title, details, can_subscribe, starts_at FROM activities WHERE starts_at > datetime('now')";
    db.all(sql, (err, activities) => {
        if (err !== null) {
            console.log(err);
            return;
        }

        res.json({ activities });
    });
});

router.get('/activities/:activityId([0-9]+)/subscriptions', (req, res) => {
    if (req.params.activityId === undefined) {
        res.status(400).json({ error: 'No activity specified' });
        return;
    }
    let activityId = parseInt(req.params.activityId, 10);

    const sql =
        'SELECT id, activity_id, hostname FROM subscriptions WHERE activity_id = ?';
    db.all(sql, [activityId], (err, subscriptions) => {
        if (err !== null) {
            console.log(err);
            return;
        }

        res.json({ subscriptions });
    });
});

router.post('/activities/:activityId([0-9]+)/subscriptions', (req, res) => {
    if (req.params.activityId === undefined) {
        res.status(400).json({ error: 'No activity specified' });
        return;
    }
    let activityId = parseInt(req.params.activityId, 10);

    const sql = 'SELECT id, can_subscribe FROM activities WHERE id = ?';
    db.get(sql, [activityId], (err, row) => {
        if (err !== null) {
            console.log(err);
            return;
        }

        if (row.can_subscribe != 1) {
            res.status(403).json({
                error: 'Cannot subscribe to this activity',
            });
            return;
        }

        // get the hostname and insert

        getHostnameFromIp(req.connection.remoteAddress, (hostname) => {
            const sql = 'INSERT INTO subscriptions VALUES (NULL, ?, ?)';
            db.run(sql, [activityId, hostname], (err) => {
                if (err !== null) {
                    res.status(400).json({ error: 'Already subscribed' });
                    return;
                }
                res.json('Subscribed to activity');
            });
        });
    });
});

function sendMessage(hostname: string, body: string, time = new Date()) {
    // save the message in the database
    const sql =
        'INSERT INTO shoutbox (id, hostname, body, sent_at) VALUES (NULL, ?, ?, ?)';
    db.run(sql, [hostname, body, time.toJSON()], function(err) {
        if (err !== null) {
            console.log('SQLite error!', err);
            return;
        }

        getNickFromHostname(hostname, (nick) => {
            let username = hostname;
            if (nick !== null) {
                username = nick + ' [' + hostname + ']';
            }
            // emit the message to the shoutbox
            const message = {
                id: this.lastID,
                nick,
                username,
                hostname,
                body,
                time,
            };
            ioShoutbox.emit('shoutbox message', message);
        });
    });
}

function getHostnameFromIp(ip: string, callback = (hostname: string) => {}) {
    dns.reverse(ip, (err, domains) => {
        let hostname = domains[0];

        for (let i in domains) {
            let domain = domains[i];
            if (domain.endsWith('.gepwnage.lan')) {
                hostname = domain.replace('.gepwnage.lan', '');
                break;
            }
            if (domain !== 'localhost') {
                hostname = domain;
            }
        }

        callback(hostname);
    });
}

function getNickAndHostnameFromIp(
    ip: string,
    callback = (nick: string, hostname: string) => {},
) {
    getHostnameFromIp(ip, (hostname) => {
        getNickFromHostname(hostname, (nick) => callback(nick, hostname));
    });
}

function getNickFromHostname(
    hostname: string,
    callback = (nick: string) => {},
) {
    const sql = 'SELECT nick FROM nicknames WHERE hostname = ?';
    db.all(sql, [hostname], (err, rows) => {
        if (err !== null) {
            console.log(err);
            return;
        }

        let nick = null;

        if (rows.length > 0) {
            nick = rows[0].nick;
        }

        callback(nick);
    });
}

export default router;
