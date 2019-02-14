import { Router } from 'express';
import {
    getHostnameFromIp,
    getNickFromHostname,
    getUsername,
} from '../data/names';
import apiRoutes from './api';
import db, {dbAll, dbRun} from '../db';
import {hostname} from "os";

const router = Router();

router.use(async (req, res, next) => {
    const hostname = await getHostnameFromIp(req);
    const nick = await getNickFromHostname(hostname);
    const username = getUsername(nick, hostname);

    res.locals.hostname = hostname;
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

router.get('/activity/:activityId([0-9]+)', (req, res) => {
    const activityId = parseInt(req.params.activityId);

    const sql =
        'SELECT id, title, details, can_subscribe FROM activities WHERE id = ?';
    db.get(sql, [activityId], (err, activity) => {
        if (err !== null || activity === undefined) {
            console.log(err);
            res.render('website/error');
            return;
        }

        const sql =
            'SELECT s.id, s.hostname, n.nick FROM subscriptions AS s ' +
            'LEFT JOIN nicknames AS n ON (s.hostname = n.hostname)' +
            'WHERE s.activity_id = ?';
        db.all(sql, [activityId], (err, rows) => {
            if (err !== null) {
                console.log(err);
                res.render('website/error');
                return;
            }

            activity.subscriptions = rows.map((s) => ({
                username:
                    s.nick === null
                        ? s.hostname
                        : s.nick + ' [' + s.hostname + ']',
                ...s,
            }));

            res.render('website/activity', { activity });
        });
    });
});

router.get('/change-nickname', (req, res) => {
	res.render('website/change-nickname', {
	    hostname: res.locals.hostname,
        nick: res.locals.nick,
        username: res.locals.username
    });
});
router.post('/change-nickname', async (req, res) => {
	// obtain the new nickname
	let nick = res.locals.nick;
	if (req.body.nickname !== undefined && typeof req.body.nickname === "string") {
		nick = req.body.nickname;
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
        username: username
    });
});

router.get('/shoutbox', (req, res) => {
    res.render('website/shoutbox');
});

export default router;
