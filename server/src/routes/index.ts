import { Router } from 'express';
import {
    getHostnameFromIp,
    getNickFromHostname,
    getUsername,
} from '../data/names';
import db, { dbAll, dbRun } from '../db';
import * as path from 'path';

const router = Router();

router.use(async (req, res, next) => {
    const host = await getHostnameFromIp(req);
    const nick = await getNickFromHostname(host.name);
    const username = getUsername(nick, host.name);

    res.locals.hostname = host.name;
    res.locals.fullHostname = host.full;
    res.locals.ip = host.ip;
    res.locals.nick = nick;
    res.locals.username = username;

    next();
});

router.get('/', (req, res) => {
    res.render('website/welcome');
});

router.get('/beamer', (req, res) => {
    res.render('beamer');
});

router.get('/schedule', (req, res) => {
    const sql =
        "SELECT id, title, details, can_subscribe FROM activities WHERE starts_at > date('now')";
    db.all(sql, (err, rows) => {
        if (err !== null) {
            console.log(err);
            res.render('website/error');
            return;
        }

        res.render('website/schedule', { activities: rows });
    });
});

const getActivity = (req: any, res: any) => {
    const activityId = parseInt(req.params.activityId);

    const sql =
        'SELECT id, title, details, can_subscribe, description FROM activities WHERE id = ?';
    db.get(sql, [activityId], (err, activity: {id: number, title: string, details: string, can_subscribe: boolean, description: string, subscriptions: any[]}) => {
        if (err !== null || activity === undefined) {
            console.log(err);
            res.render('website/error');
            return;
        }

        const sql =
            'SELECT s.id, s.hostname, n.nick FROM subscriptions AS s ' +
            'LEFT JOIN nicknames AS n ON (s.hostname = n.hostname)' +
            'WHERE s.activity_id = ?';
        db.all(sql, [activityId], (err, rows: {id: number, hostname: string, nick: string}[]) => {
            if (err !== null) {
                console.log(err);
                res.render('website/error');
                return;
            }

            activity.subscriptions = rows.map((s) => ({
                username: getUsername(s.nick, s.hostname),
                ...s,
            }));

            // Find out whether the current user is already subscribed
            const { hostname } = res.locals;
            const is_subscribed =
                rows.findIndex((s) => s.hostname === hostname) !== -1;

            res.render('website/activity', { activity, is_subscribed });
        });
    });
};

router.get('/activity/:activityId([0-9]+)', getActivity);
router.get('/activity/:activityId([0-9]+)/subscribe', getActivity);

router.post('/activity/:activityId([0-9]+)/subscribe', async (req, res) => {
    const activityId = parseInt(req.params.activityId);

    const sql =
        'SELECT id, title, details, can_subscribe FROM activities WHERE id = ?';
    db.get(sql, [activityId], async (err, activity: {id: number, title: string, details: string, can_subscribe: boolean}) => {
        if (err !== null || activity === undefined) {
            console.log(err);
            res.render('website/error');
            return;
        }

        if (activity.can_subscribe) {
            try {
                await dbRun('INSERT INTO subscriptions VALUES (NULL, ?, ?)', [
                    activityId,
                    res.locals.hostname,
                ]);
            } catch (err) {
                // Ignore constraint errors (probably unique clause violation)
                if (err.code !== 'SQLITE_CONSTRAINT') {
                    console.log(err);
                    res.render('website/error');
                    return;
                }
            }
        }

        // Return to activity page
        res.redirect(`/activity/${activityId}`);
    });
});

router.post('/activity/:activityId([0-9]+)/unsubscribe', async (req, res) => {
    const activityId = parseInt(req.params.activityId);

    try {
        await dbRun('DELETE FROM subscriptions AS s WHERE s.activity_id = ? AND s.hostname = ?', [
            activityId,
            res.locals.hostname,
        ]);
        // Return to activity page
        res.redirect(`/activity/${activityId}`);
    } catch (err) {
        console.log(err);
        res.render('website/error');
        return;
    }
});

router.get('/change-nickname', (req, res) => {
    res.render('website/change-nickname', {
        hostname: res.locals.hostname,
        nick: res.locals.nick,
        username: res.locals.username,
    });
});
router.post('/change-nickname', async (req, res) => {
    // obtain the new nickname
    let nick = res.locals.nick;
    if (
        req.body.nickname !== undefined &&
        typeof req.body.nickname === 'string'
    ) {
        nick = req.body.nickname;
    }
    if (nick.length > 32) {
        nick = nick.substr(0, 32);
    }
    const hostname = res.locals.hostname;
    const username = getUsername(nick, hostname);

    // store the new nickname

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
        } else {
            await dbRun('INSERT INTO nicknames VALUES (?, ?)', [
                hostname,
                nick,
            ]);
        }
    } catch (err) {
        console.log(err);
        return;
    }

    res.render('website/change-nickname', {
        hostname: hostname,
        nick: nick,
        username: username,
    });
});

router.get('/competitions', async (req, res) => {
    try {
        const rows = await dbAll(`
            SELECT a.id, a.title, a.details, a.header, a.description, a.can_subscribe, COUNT(s.id) as num_participants
            FROM activities a
            LEFT JOIN subscriptions s on a.id = s.activity_id
            WHERE a.can_subscribe = 1
            GROUP BY a.id
            ORDER BY a.starts_at ASC
        `);

        const competitions = rows.map((row) => ({
            ...row,
            title: row.title.replace('Competition: ', '')
        }));

        res.render('website/competitions', { competitions });
    } catch (err) {
        throw err;
    }
});

router.get('/shoutbox', (req, res) => {
    res.render('website/shoutbox');
});

router.get('/services', (req, res) => {
    res.render('website/services');
});

router.get('/paint', (req, res) => {
    res.render('website/paint');
});

router.get('/paint/history', (req, res) => {
    res.render('website/paint-history');
});

router.get('/challenge', async (req, res) => {
    const challenges = await dbAll("SELECT id, game, best FROM challenge");
    res.render('website/challenge', { challenges });
});

export default router;
