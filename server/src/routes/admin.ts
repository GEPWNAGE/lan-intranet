import { Router } from 'express';
import {
    getHostnameFromIp,
    getNickFromHostname,
    getUsername,
} from '../data/names';
import db, { dbAll, dbRun } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

router.use((req, res, next) => {
    const cookie = req.cookies['pwn-admin'];

    res.locals.loggedin = false;

    if (cookie) {
        const decoded = <any>jwt.verify(cookie, 'TODO: move secret to .env');

        if (decoded) {
            res.locals.loggedin = true;
            res.locals.login = decoded.login;
        }
    }

    next();
});

router.get('/', (req, res) => {
    if (res.locals.loggedin) {
        res.render('admin/welcome');
        return;
    }
    res.render('admin/login');
});
router.get('/login', (req, res) => {
    if (res.locals.loggedin) {
        res.redirect('/admin');
        return;
    }
    res.render('admin/login');
});

router.post('/login', async (req, res) => {
    const logins = await dbAll("SELECT login, hash FROM logins WHERE login = ?", [ req.body.login ]);

    if (logins.length != 1) {
        res.render('admin/login', {
            error: true,
            login: req.body.login
        });
        return;
    }

    const login = logins[0];

    if (!await bcrypt.compare(req.body.password, login.hash)) {
        res.render('admin/login', {
            error: true,
            login: req.body.login
        });
        return;
    }

    // sign a token including expiration
    const token = jwt.sign({
        login: req.body.login
    }, 'TODO: move secret to .env', {
        expiresIn: '1h'
    });

    res.locals.loggedin = true;
    res.locals.login = req.body.login;

    // login verified, now save that the user is logged in
    res.cookie('pwn-admin', token);

    res.render('admin/login-success');
});

router.get('/logout', (req, res) => {
    res.cookie('pwn-admin', '', { expires: new Date() });

    res.locals.loggedin = false;
    delete res.locals.login;

    res.render('admin/logout');
});

router.get('/challenge', async (req, res) => {
    if (!res.locals.loggedin) {
        res.redirect('/admin/login');
        return;
    }

    const challenges = await dbAll("SELECT id, game, best FROM challenge");
    res.render('admin/challenge', { challenges });
});

router.get('/challenge/:challengeId([0-9]+)', async (req, res) => {
    if (!res.locals.loggedin) {
        res.redirect('/admin/login');
        return;
    }

    const id = parseInt(req.params.challengeId);

    const sql = "SELECT id, game, best FROM challenge WHERE id = ?";
    db.get(sql, [id], async (err, challenge) => {
        if (err !== null || challenge === undefined) {
            console.log(err);
            res.render('website/error');
            return;
        }

        res.render('admin/challenge-edit', {
            challenge
        });
    });
});

router.post('/challenge/:challengeId([0-9]+)', async (req, res) => {
    if (!res.locals.loggedin) {
        res.redirect('/admin/login');
        return;
    }

    const id = parseInt(req.params.challengeId);

    const sql = "SELECT id, game, best FROM challenge WHERE id = ?";
    db.get(sql, [id], async (err, challenge) => {
        if (err !== null || challenge === undefined) {
            console.log(err);
            res.render('website/error');
            return;
        }

        const changeSql = "UPDATE challenge SET best = ? WHERE id = ?";

        try {
            await dbRun(changeSql, [req.body.best, id]);

            res.redirect('/admin/challenge');
        } catch (err) {
            console.log(err);

            res.render('admin/challenge-edit', {
                challenge
            });
        }

    });
});

export default router;
