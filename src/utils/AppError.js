class AppError {
    message;
    statusCode;

    constructor(message, StatusCode = 400){
        this.message = message;
        this.statusCode = StatusCode;
    }
}

module.exports = AppError;
