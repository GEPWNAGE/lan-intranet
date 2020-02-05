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

router.post('/login', (req, res) => {
    bcrypt.hash(req.body.password, 11).then((hashed: any) => console.log(hashed));

    res.render('admin/login');
});

export default router;
