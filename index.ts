import express from 'express';
import home from './routes/home';
import category from './routes/category';
import post from './routes/posts';
import user from './routes/user';

const port = Bun.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use('/', home);
app.use('/api/bmagazine/category', category);
app.use('/api/bmagazine/posts', post);
app.use('/api/bmagazine/users', user);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
