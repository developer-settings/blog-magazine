import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Router } from 'express';
import lodash from 'lodash';
import { userSchema } from '../types/schema';
const router = Router();

const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  res.send('This is the User Page!');
});

router.post('/', async (req, res) => {
  const salt = await bcrypt.genSalt(10);

  const validation = userSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json(validation.error.errors[0].message);
  }

  let user = await prisma.user.findFirst({ where: { email: req.body.email } });
  if (user) {
    return res.status(400).json('User already exists');
  }

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

    res.send(lodash.pick(user, ['id', 'first_name', 'last_name', 'email']));
    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
});

export default router;
