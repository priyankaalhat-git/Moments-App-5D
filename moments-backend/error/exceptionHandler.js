const process = require('process');

const Exceptions =  { 
    UNCAUGHT_EXCEPTION : 'uncaughtException', 
    UNHANDLED_REJECTION : 'unhandledRejection' 
};

/**
 * Exception Handler is responsible for handling uncaught exceptions and unhandled promise rejections.
 */

const handleExceptions = () => {
    process.on(Exceptions.UNCAUGHT_EXCEPTION, async (ex) => {
        const stack = JSON.stringify(ex, Object.getOwnPropertyNames(ex));
        /**
         * trigger logger
         * transport file, console and db.
         */
        console.log('⛔ Uncaught Exception Occured: ', ex)
        console.log('⌛ Terminating Application ...')
        setTimeout(() => {
            console.log('✅ Application Terminated.')
            process.exit()
        }, 5000);
    });

    process.on(Exceptions.UNHANDLED_REJECTION, async (ex) => {
        const stack = JSON.stringify(ex, Object.getOwnPropertyNames(ex));
        /**
         * trigger logger
         * transport file, console and db.
         */
        console.log('⛔ Unhandled Exception Occured: ', ex);
        console.log('⌛ Terminating Application ...')
        setTimeout(() => {
            console.log('✅ Application Terminated.')
            process.exit()
        }, 5000);
    });
};

module.exports = {
    handleExceptions
};