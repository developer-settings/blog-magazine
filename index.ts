import express from 'express';
import home from './routes/home';
import category from './routes/category';
import post from './routes/posts';
import users from './routes/users';
import auth from './routes/authentification';
import helmet from 'helmet';
import compression from 'compression';

const port = Bun.env.PORT || 3000;
const JWT_SECRET = Bun.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(helmet());
app.use(compression());

app.use('/', home);
app.use('/api/bmagazine/category', category);
app.use('/api/bmagazine/posts', post);
app.use('/api/bmagazine/users', users);
app.use('/api/bmagazine/auth', auth);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
