import { Router } from 'express';
import { userSchema } from '../types/schema';
import { PrismaClient } from '@prisma/client';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import lodash from 'lodash';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const validation = userSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json(validation.error.errors[0].message);
  }

  let user = await prisma.user.findFirst({ where: { email: req.body.email } });
  if (user) {
    return res.status(400).json('User already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(validation.data.hashed_password, salt);

  try {
    user = await prisma.user.create({
      data: {
        first_name: validation.data.first_name,
        last_name: validation.data.last_name,
        email: validation.data.email,
        hashed_password: password,
      },
    });
    const token = jsonwebtoken.sign(
      {
        id: user.id,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      Bun.env.JWT_SECRET!
    );
    res
      .header('x-auth-token', token)
      .send(lodash.pick(user, ['id', 'first_name', 'last_name', 'email']));

    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
});

export default router;
