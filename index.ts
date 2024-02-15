import express from 'express';
import home from './routes/home';

const app = express();
app.use(express.json());

app.use('/', home);

const port = Bun.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
