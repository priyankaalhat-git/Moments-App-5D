const { StatusCodes } =  require("http-status-codes");
/**
 * Async Error Handler to capture and return error to end user. [Error Handler]
 * @param err: Error
 * @param req: Request
 * @param res: Response
 * @param next: NextFunction
 * @returns 
 */

const errorHandler = (err, req, res, next) => {
    
    let { message } = err;

    res.locals.errorMessage = err.message;
  
    if (!message) message = 'Internal Server Error ⛔';

    const response = {
      status: false,
      message,
      stack: err.stack
    };
  
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
};

module.exports = {
  errorHandler
};