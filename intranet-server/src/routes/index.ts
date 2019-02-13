import { Router } from 'express';
import apiRoutes from './api';
import db from '../db';

const router = Router();

router.use('/api', apiRoutes);

router.get('/', (req, res) => {
    res.render('website/index');
});

router.get('/beamer', (req, res) => {
    res.render('beamer');
});

router.get('/schedule', (req, res) => {
    const sql = "SELECT id, title, details, can_subscribe FROM activities WHERE starts_at > date('now')";
    db.all(sql, (err, rows) => {
        if (err !== null) {
            // TODO: render error page
            return;
        }

        res.render('website/schedule', { activities: rows });
    });
});

export default router;
