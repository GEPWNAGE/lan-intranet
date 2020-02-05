import { Router } from 'express';
import {
    getHostnameFromIp,
    getNickFromHostname,
    getUsername,
} from '../data/names';
import db, { dbAll, dbRun } from '../db';

const router = Router();

router.get('/', (req, res) => {
    res.render('admin/login');
});

export default router;
