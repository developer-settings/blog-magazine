import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
  res.send('This is the Categories Page!');
});

export default router;
