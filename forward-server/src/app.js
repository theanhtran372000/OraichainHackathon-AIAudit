const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const { notFound, errorHandler } = require('./middlewares');

const app = express();

require('dotenv').config();

const port = process.env.PORT || 8080;

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

const contract = require('./routes/contract');

app.use('/api/contract', contract);


app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Forwarding Server is listening on port ${port}.`));