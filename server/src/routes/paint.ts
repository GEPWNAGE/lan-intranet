import { Router } from 'express';

import paintdb, { paintdbAll, paintdbGet, paintdbRun } from '../paintdb';
import {
    getHostnameFromIp,
    getNickFromHostname,
    getUsername,
} from '../data/names';

const router = Router();

router.post('/pixel', async (req, res) => {

    console.log(req.body);

    res.json({
        success: true
    });
});

export default router;
