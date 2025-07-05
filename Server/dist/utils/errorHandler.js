"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// using  type Request, type Response as remove error for build
const errorHandler = (err, _req, res, _next) => {
    console.error(err.stack);
    res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
};
exports.errorHandler = errorHandler;
