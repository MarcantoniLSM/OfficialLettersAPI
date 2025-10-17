require('dotenv').config();
const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const lettersRouter = require('./routes/officialLetters');

app.use(express.json());
app.use('/users', usersRouter);
app.use('/letters', lettersRouter);

app.get('/', (req, res) => res.json({ message: 'API de Usuários — up' }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
