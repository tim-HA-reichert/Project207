import { setUncaughtExceptionCaptureCallback } from "node:process"

const HTTP_CODES = {

    SUCCESS: {
        OK: 200
    },
    CLIENT_ERROR: {
        NOT_FOUND: 404,
        BAD_INPUT: 400
    }
}

export default HTTP_CODES;