
const express = require('express')
const bodyParser = require('body-parser')
const router = require('./router/index');
require('./model')
const { PORT } = require('./configs/config')

const app = express()

app.use(express.json());
app.use(bodyParser.json())

app.use('/', router);

app.listen(PORT, () => {
    console.log('app will be run on: http://localhost:3000')
})





// const express = require('express');
// const bodyParser = require('body-parser');
// const router = require('./router/index');
// const { PORT } = require('./configs/config');
// const { requestLogger, authenticate, errorHandler } = require('./middlewares');

// const app = express();

// app.use(express.json());
// app.use(bodyParser.json());

// // Use request logger middleware for all routes
// app.use(requestLogger);

// // Public routes (no authentication required)
// app.use('/api', router);

// // Use error handling middleware
// app.use(errorHandler);

// // Start the server
// app.listen(PORT, () => {
//     console.log(`App is running on: http://localhost:${PORT}`);
// });



