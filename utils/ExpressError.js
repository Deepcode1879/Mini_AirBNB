class ExpressError extends Error{
    constructor(statusCode,message) {
        super(message);
        this.statusCode=statusCode;
        this.name="ExpressError";
        this.message=message;
    }
}

module.exports = ExpressError;