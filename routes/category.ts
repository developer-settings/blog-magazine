import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import { Router } from 'express';
import { categorySchema } from '../types/schema';
import { authorization } from '../middleware/authorization';
import { admin } from '../middleware/admin';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    const defaultHeaders = {
      count: categories.length,
      results: categories,
    };
    res.status(200).json(defaultHeaders);
    await prisma.$disconnect();
  } catch (error) {
    res.status(500).json({ error: 'Error' });
    await prisma.$disconnect();
    process.exit(1);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
    });
    if (!category) {
      res.status(404).json('Category not found');
      await prisma.$disconnect();
      return;
    }
    res.status(200).json(category);
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
    const validation = categorySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json(validation.error.errors[0].message);
    }

    const isCategoryExists = await prisma.category.findFirst({
      where: { name: validation.data.name },
    });

    if (isCategoryExists) {
      return res.status(400).json('Category already exists');
    }

    try {
      const category = await prisma.category.create({
        data: {
          name: validation.data.name,
          slug: validation.data.name.toLowerCase().replace(' ', '-'),
        },
      });
      res.status(201).json(category);
      await prisma.$disconnect();
      return;
    } catch (error) {
      res.status(500).json({ error: 'Error while creating category' });
      await prisma.$disconnect();
      process.exit(1);
    }
  }
);

router.patch(
  '/:id',
  [authorization, admin],
  async (req: Request, res: Response) => {
    const validation = categorySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json(validation.error.errors[0].message);
    }

    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
    });

    if (!category) {
      return res.status(404).json('Category not found');
    }

    const isCategoryExists = await prisma.category.findFirst({
      where: { name: validation.data.name },
    });

    if (isCategoryExists) {
      return res.status(400).json('Category already exists');
    }

    try {
      const category = await prisma.category.update({
        where: { id: req.params.id },
        data: {
          name: validation.data.name,
          slug: validation.data.name.toLowerCase().replace(' ', '-'),
        },
      });
      res.status(200).json(category);
      await prisma.$disconnect();
      return;
    } catch (error) {
      res.status(500).json({ error: 'Error while updating category' });
      await prisma.$disconnect();
      process.exit(1);
    }
  }
);


router.delete(
  '/:id',
  [authorization, admin],
  async (req: Request, res: Response) => {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
    });

    if (!category) {
      return res.status(404).json('Category not found');
    }

    try {
      await prisma.category.delete({
        where: { id: req.params.id },
      });
      res.status(204).json('Category deleted');
      await prisma.$disconnect();
      return;
    } catch (error) {
      res.status(500).json({ error: 'Error while deleting category' });
      await prisma.$disconnect();
      process.exit(1);
    }
  }
);

export default router;
