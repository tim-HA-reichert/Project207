const HTTP_CODES = {

    SUCCESS: {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NO_CONTENT: 204,
    },
    CLIENT_ERROR: {
        NOT_FOUND: 404,
        UNAUTHORIZED: 401,
        BAD_INPUT: 400,
        FORBIDDEN: 403,
        REQ_TIMEOUT: 408
    }
}

export default HTTP_CODES;