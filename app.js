require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connect')

//extra security for express
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const exp = require('express-rate-limit')


// error handler
const authentication = require('./middleware/authentication')
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const routes = require('./routes/jobs')
const route = require('./routes/auth')

app.set('trust proxy', 1)
app.use(exp({
  windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100
}))

app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())


// extra packages

// routes
app.use('/api/v1',route)
app.use('/api/v1',authentication,routes)

app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
