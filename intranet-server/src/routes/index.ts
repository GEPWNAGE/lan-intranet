import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.render('website/index');
});

router.get('/beamer', (req, res) => {
    res.render('beamer');
});

export default router;
