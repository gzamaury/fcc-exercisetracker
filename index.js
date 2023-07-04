import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import usersRouter from './routes/users.js';
import exercisesRouter from './routes/exercises.js';
import logsRouter from './routes/logs.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use('/api/users', usersRouter);
app.use('/api/users', exercisesRouter);
app.use('/api/users', logsRouter);

const port = process.env.PORT || 3000;
let server = app;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, () => {
    console.log('Your app is listening on port ' + port);
  });
}

export default server;
