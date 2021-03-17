require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const authRouter = require('./routers/authRouter');
const vacancyRouter = require('./routers/vacancyRouter');
const { handlerErrors } = require('./errors/handlerErrors');
const { initDatabase } = require('./helpers/initDatabase');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(morgan('combined'));
app.use('/auth', authRouter);
app.use('/vacancy', vacancyRouter);
app.use(handlerErrors);

app.listen(PORT, async () => {
  await initDatabase();

  console.log('Server started listening on port', PORT);
});
