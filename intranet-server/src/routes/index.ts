import { Router } from 'express';
import {
    getHostnameFromIp,
    getNickFromHostname,
    getUsername,
} from '../data/names';
import apiRoutes from './api';
import db from '../db';

const router = Router();

router.use(async (req, res, next) => {
    const hostname = await getHostnameFromIp(req.connection.remoteAddress);
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

export default router;
