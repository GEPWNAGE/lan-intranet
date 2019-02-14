import { Router } from 'express';
import {
    getHostnameFromIp,
    getNickFromHostname,
    getUsername,
} from '../data/names';
import db, { dbAll, dbRun } from '../db';

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

const getActivity = (req: any, res: any) => {
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
};

router.get('/activity/:activityId([0-9]+)', getActivity);
router.get('/activity/:activityId([0-9]+)/subscribe', getActivity);

router.post('/activity/:activityId([0-9]+)/subscribe', async (req, res) => {
    const activityId = parseInt(req.params.activityId);

    const sql =
        'SELECT id, title, details, can_subscribe FROM activities WHERE id = ?';
    db.get(sql, [activityId], async (err, activity) => {
        if (err !== null || activity === undefined) {
            console.log(err);
            res.render('website/error');
            return;
        }

        if (activity.can_subscribe == 1) {
            try {
                await dbRun('INSERT INTO subscriptions VALUES (NULL, ?, ?)', [
                    activityId,
                    res.locals.hostname,
                ]);
            } catch (err) {
                console.log(err);
                res.render('website/error');
                return;
            }
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
            SELECT a.id, title, details, can_subscribe, COUNT(s.id) as num_participants
            FROM activities a
            LEFT JOIN subscriptions s on a.id = s.activity_id
            WHERE a.title LIKE 'Competition%'
            GROUP BY a.id
        `);

        // Don't worry, I hate myself too.
        function getCompetitionProps(row: any) {
            if (row.title.includes('Xonotic')) {
                return {
                    header: 'static/images/xonotic.jpg',
                    description: '???',
                };
            } else if (row.title.includes('Just Dance')) {
                return {
                    header: 'static/images/just-dance.png',
                    description: '???',
                };
            } else if (row.title.includes('Keep Talking')) {
                return {
                    header: 'static/images/keep-talking.png',
                    description: `
                        We'll provide the game and bomb defusal manuals. You 
                        provide a team of 2 to 4 people and a very specific set 
                        of skills. (Personalized bomb defusal manuals are 
                        allowed.)
                    `,
                };
            } else if (row.title.includes('Rocket League')) {
                return {
                    header: 'static/images/rocket-league.jpg',
                    description: `
                        We'll be playing 2v2 soccar matches on a LAN server in a
                        double-elimination tournament. Please make sure you have
                        a copy of the game installed on your system!
                    `,
                };
            }
        }

        const competitions = rows.map((row) => ({
            ...row,
            title: row.title.replace('Competition: ', ''),
            ...getCompetitionProps(row),
        }));

        res.render('website/competitions', { competitions });
    } catch (err) {
        throw err;
    }
});

router.get('/shoutbox', (req, res) => {
    res.render('website/shoutbox');
});

export default router;
