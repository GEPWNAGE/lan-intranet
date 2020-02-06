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
    res.render('admin/login');
});
router.get('/login', (req, res) => {
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

    // TODO: set expiration
    const token = jwt.sign({ login: req.body.login }, 'TODO: move secret to .env');

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

export default router;
