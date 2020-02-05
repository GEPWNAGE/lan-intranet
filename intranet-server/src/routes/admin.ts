import { Router } from 'express';
import {
    getHostnameFromIp,
    getNickFromHostname,
    getUsername,
} from '../data/names';
import db, { dbAll, dbRun } from '../db';
import bcrypt from 'bcrypt';

const router = Router();

router.get('/', (req, res) => {
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

    res.render('admin/login-success');
});

export default router;
