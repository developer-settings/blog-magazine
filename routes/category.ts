import { Router } from 'express';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, async (req, res) => {
  const user_id = req.user.id;

  res.send(`User ID: ${user_id}`);
});

export default router;
