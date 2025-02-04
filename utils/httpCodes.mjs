import { setUncaughtExceptionCaptureCallback } from "node:process"

const HTTP_CODES = {

    SUCCESS: {
        OK: 200,
        ACCEPTED: 202,
    },
    CLIENT_ERROR: {
        NOT_FOUND: 404,
        NOT_AUTH: 401,
        BAD_INPUT: 400,
    }
}

export default HTTP_CODES;