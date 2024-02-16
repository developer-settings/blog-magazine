import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { validateUser } from '../types/schema';
const router = Router();

const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const validation = validateUser.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json(validation.error.errors[0].message);
  }

  let user = await prisma.user.findFirst({ where: { email: req.body.email } });
  if (!user) {
    return res.status(400).json('Invalid email or password');
  }

  const validPassword = await bcrypt.compare(
    validation.data.hashed_password,
    user.hashed_password
  );
  if (!validPassword) {
    return res.status(400).json('Invalid email or password');
  }

  try {
    const token = jsonwebtoken.sign(
      {
        id: user.id,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      Bun.env.JWT_SECRET!
    );
    res.header('x-auth-token', token);
    res.send(token);
    await prisma.$disconnect();
    return;
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
});

export default router;
