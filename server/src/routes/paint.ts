import { Router } from 'express';

import paintdb, { paintdbAll, paintdbGet, paintdbRun } from '../paintdb';
import {
    getHostnameFromIp,
    getNickFromHostname,
    getUsername,
} from '../data/names';

const router = Router();

export default router;
