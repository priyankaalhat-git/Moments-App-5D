const cors = require('cors');
const morgan = require('morgan');

function initializeMiddlewares (app) {
    app.use(cors());
    app.use(morgan('dev'));
}

module.exports = initializeMiddlewares;