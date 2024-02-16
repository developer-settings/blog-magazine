import type { Request, Response } from 'express';
import { Router } from 'express';
import { authorization } from '../middleware/authorization';

import { admin } from '../middleware/admin';
const router = Router();

router.get('/', [authorization, admin], async (req: Request, res: Response) => {
  const user_id = req.user.id;

  res.send(`User ID: ${user_id}`);
});

export default router;
