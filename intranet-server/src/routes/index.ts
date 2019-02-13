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
            console.log(err);
            res.render('website/error');
            return;
        }

        res.render('website/schedule', { activities: rows });
    });
});

router.get('/activity/:activityId([0-9]+)', (req, res) => {
    const activityId = parseInt(req.params.activityId);

    const sql = "SELECT id, title, details, can_subscribe FROM activities WHERE id = ?";
    db.get(sql, [activityId], (err, activity) => {
        if (err !== null || activity === undefined) {
            console.log(err);
            res.render('website/error');
            return;
        }

        const sql = "SELECT s.id, s.hostname, n.nick FROM subscriptions AS s " +
            "LEFT JOIN nicknames AS n ON (s.hostname = n.hostname)" +
            "WHERE s.activity_id = ?";
        db.all(sql, [activityId], (err, rows) => {
            if (err !== null) {
                console.log(err);
                res.render('website/error');
                return;
            }

            activity.subscriptions = rows.map(s => ({
                username: s.nick === null ? s.hostname : s.nick + ' [' + s.hostname + ']',
                ...s
            }));

            res.render('website/activity', { activity });
        });
    });
});

export default router;
