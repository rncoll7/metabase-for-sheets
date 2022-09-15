class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
    }
}

class HttpError extends Error {
    constructor(message, status, payload) {
        super(message);
        this.name = "MetabaseError";
        this.status = status;
        this.payload = payload;
    }
}