import { Router } from 'express';
import apiRoutes from './api';

const router = Router();

router.use('/api', apiRoutes);

router.get('/', (req, res) => {
    res.render('website/index');
});

router.get('/beamer', (req, res) => {
    res.render('beamer');
});

export default router;
