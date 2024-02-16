import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import { Router } from 'express';
import { admin } from '../middleware/admin';
import { authorization } from '../middleware/authorization';
import { postSchema } from '../types/schema';
import { uploadImage } from '../utils';

const router = Router();

const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    const defaultHeaders = {
      count: posts.length,
      results: posts,
    };
    res.status(200).json(defaultHeaders);
    await prisma.$disconnect();
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error' });
    await prisma.$disconnect();
    process.exit(1);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
    });
    if (!post) {
      res.status(404).json('Post not found');
      await prisma.$disconnect();
      return;
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error' });
    await prisma.$disconnect();
    process.exit(1);
  }
});

router.post(
  '/',
  [authorization, admin],
  async (req: Request, res: Response) => {
    try {
      const validation = postSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json(validation.error.errors[0].message);
      }

      const post = await prisma.post.create({
        data: {
          title: validation.data.title,
          content: validation.data.content,
          category_id: validation.data.category_id,
          image_url: await uploadImage(validation.data.image_url!),
          slug: validation.data.title.toLowerCase().split(' ').join('-'),
          user_id: req.user.id,
        },
      });

      res.status(201).send(post);
      await prisma.$disconnect();
      return;
    } catch (error) {
      res.status(500).json({ error: 'Error' });
      await prisma.$disconnect();
      process.exit(1);
    }
  }
);

router.put(
  '/:id',
  [authorization, admin],
  async (req: Request, res: Response) => {
    try {
      const validation = postSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json(validation.error.errors[0].message);
      }

      const post = await prisma.post.update({
        where: { id: req.params.id },
        data: {
          title: validation.data.title,
          content: validation.data.content,
          category_id: validation.data.category_id,
          image_url: await uploadImage(validation.data.image_url!),
          slug: validation.data.title.toLowerCase().split(' ').join('-'),
        },
      });

      res.status(200).send(post);
      await prisma.$disconnect();
      return;
    } catch (error) {
      res.status(500).json({ error: 'Error' });
      await prisma.$disconnect();
      process.exit(1);
    }
  }
);

router.delete(
  '/:id',
  [authorization, admin],
  async (req: Request, res: Response) => {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
    });
    if (!post) {
      res.status(404).json('Post not found');
      await prisma.$disconnect();
      return;
    }
    try {
      const post = await prisma.post.delete({
        where: { id: req.params.id },
      });
      res.status(200).json(post);
      await prisma.$disconnect();
      return;
    } catch (error) {
      res.status(500).json({ error: 'Error' });
      await prisma.$disconnect();
      process.exit(1);
    }
  }
);

export default router;
