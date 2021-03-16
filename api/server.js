const express = require('express');
const morgan = require('morgan');
const authRouter = require('./routers/authRouter');
const { handlerErrors } = require('./errors/handlerErrors');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(morgan('combined'));
app.use('/auth', authRouter);
app.use(handlerErrors);

app.listen(PORT, () => {
  console.log('Server started listening on port', PORT);
});
