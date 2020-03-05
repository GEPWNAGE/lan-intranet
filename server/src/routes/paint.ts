import { Router } from 'express';

import paintdb, { paintdbAll, paintdbGet, paintdbRun } from '../paintdb';
import {
    getHostnameFromIp,
    getNickFromHostname,
    getUsername,
} from '../data/names';
import { ioPaint } from '../index';

const router = Router();

router.post('/pixel', async (req, res) => {
    // validation
    if (typeof req.body.x !== 'number' || typeof req.body.y !== 'number') {
        res.json({ success: false });
        return;
    }
    if (req.body.x < 0 || req.body.x >= 128 || req.body.y < 0 || req.body.y >= 128) {
        res.json({ success: false });
        return;
    }
    if (!/^#[0-9a-fA-F]{6}$/.test(req.body.color)) {
        res.json({ success: false });
        return;
    }

    await paintdbRun(
        'UPDATE grid SET color=? WHERE x=? AND y=?',
        [
            req.body.color,
            req.body.x,
            req.body.y
        ]
    );

    ioPaint.emit('pixel change', {
        x: req.body.x,
        y: req.body.y,
        color: req.body.color
    });

    res.json({
        success: true
    });

    const hostname = await getHostnameFromIp(req);

    paintdbRun(
        'INSERT INTO history (id, x, y, color, hostname) VALUES (NULL, ?, ?, ?, ?)',
        [
            req.body.x,
            req.body.y,
            req.body.color,
            hostname.ip
        ]
    );
});

router.get('/grid', async (req, res) => {
    let grid : string[][] = [];

    for (let y = 0; y < 128; y++) {
        let row = [];
        for (let x = 0; x < 128; x++) {
            row.push('#013370');
        }
        grid.push(row);
    }

    const rows = await paintdbAll(
        "SELECT x, y, color FROM grid WHERE x >= 0 AND x < 128 AND y >= 0 AND y < 128"
    );

    for (const rownum in rows) {
        const row = rows[rownum];
        grid[row.y][row.x] = row.color;
    }

    res.json(grid);
});

export default router;
